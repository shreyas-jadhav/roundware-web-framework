import { SpeakerTrack } from "./speaker_track";
import { Playlist } from "./playlist";
import { buildAudioContext, coordsToPoints, getUrlParam } from "./utils";
import { AssetPool } from "./assetPool";
import { IRoundware } from "./roundware";
import { Point } from "@turf/helpers";

export const GeoListenMode = Object.freeze({
  DISABLED: 0,
  MANUAL: 1,
  AUTOMATIC: 2,
});

export interface IMixer {
  playlist: unknown;
  playing: boolean;
  mixParams: unknown;
  updateParams({
    listenerLocation,
    listenerPoint,
  }: {
    listenerLocation: Coordinates;
    listenerPoint: Point;
  }): void;
}
export class Mixer implements IMixer {
  playing: boolean;
  private _windowScope: Window;
  private _client: IRoundware;
  private _prefetchSpeakerAudio: unknown | boolean;

  mixParams: unknown;
  playlist: unknown;
  constructor({
    client,
    windowScope,
    listenerLocation,
    prefetchSpeakerAudio,
    filters = [],
    sortMethods = [],
    mixParams = {},
  }: {
    client: IRoundware;
    windowScope: Window;
    listenerLocation: Coordinates;
    prefetchSpeakerAudio: boolean | unknown;
    filters?: unknown[];
    sortMethods?: unknown[];
    mixParams: object;
  }) {
    this.playing = false;

    this._windowScope = windowScope;
    this._client = client;
    this._prefetchSpeakerAudio = prefetchSpeakerAudio;
    const assets = client.assets();
    const timedAssets = client.timedAssets();

    this.mixParams = {
      listenerPoint: coordsToPoints(listenerLocation),
      ...mixParams,
    };

    this.assetPool = new AssetPool({
      assets,
      timedAssets,
      filters,
      sortMethods,
      mixParams: this.mixParams,
    });
  }

  updateParams({
    listenerLocation,
    ...params
  }: {
    listenerLocation: Coordinates;
  }) {
    if (listenerLocation) {
      params.listenerPoint = coordsToPoints(listenerLocation);
    }
    this.mixParams = { ...this.mixParams, ...params };
    if (this.playlist) {
      this.playlist.updateParams(params);
    }
    if (this.speakerTracks) {
      for (const t of this.speakerTracks) {
        t.updateParams(this.playing, params);
      }
    }
  }

  skipTrack(trackId) {
    if (this.playlist) this.playlist.skip(trackId);
  }

  replayTrack(trackId) {
    if (this.playlist) this.playlist.replay(trackId);
  }

  toString() {
    return "Roundware Mixer";
  }

  initContext() {
    if (!this.playlist) {
      const audioContext = buildAudioContext(this._windowScope);
      const listenerPoint = this.mixParams.listenerPoint;
      const speakers = this._client.speakers();

      let selectTrackId = getUrlParam(
        this._windowScope.location,
        "rwfSelectTrackId"
      );
      let audioTracks = this._client.audiotracks();

      if (selectTrackId) {
        selectTrackId = Number(selectTrackId);
        audioTracks = audioTracks.filter((t) => t.id === selectTrackId);

        console.info(`isolating track #${selectTrackId}`);
      }

      this.playlist = new Playlist({
        client: this._client,
        audioTracks,
        listenerPoint,
        assetPool: this.assetPool,
        audioContext,
        windowScope: this._windowScope,
      });

      this.speakerTracks = speakers.map(
        (speakerData) =>
          new SpeakerTrack({
            audioContext,
            listenerPoint,
            prefetchAudio: this._prefetchSpeakerAudio,
            data: speakerData,
          })
      );

      this.updateParams(this.mixParams);
    }
  }

  toggle() {
    // Build the audio context and playlist if it doesn't exist yet.
    this.initContext();

    if (this.playing) {
      this.playing = false;
      this.playlist.pause();
      this.speakerTracks.forEach((s) => s.pause());
    } else {
      this.playing = true;
      this.playlist.play();
      this.speakerTracks.forEach((s) => s.play());
    }

    return this.playing;
  }
}
