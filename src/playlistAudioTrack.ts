import { TrackOptions } from "./mixer/TrackOptions";
import { Playlist } from "./playlist";
import {
  DeadAirState,
  FadingOutState,
  LoadingState,
  makeInitialTrackState,
  TimedTrackState,
} from "./TrackStates";
import { IMixParams } from "./types";
import { IAudioTrackData } from "./types/audioTrack";
import { ITrackStates } from "./types/track-states";
import { debugLogger, getUrlParam, timestamp } from "./utils";
import { Howl, Howler } from "howler";
import { AssetEnvelope } from "./mixer/AssetEnvelope";
import { IDecoratedAsset } from "./types/asset";
import distance from "@turf/distance";
import { distanceFixedFilter } from "./assetFilters";
/*
@see https://github.com/loafofpiecrust/roundware-ios-framework-v2/blob/client-mixing/RWFramework/RWFramework/Playlist/AudioTrack.swift

 Audiotracks data looks like this:

 [{
   "id": 8,
   "minvolume": 0.7,
   "maxvolume": 0.7,
   "minduration": 200.0,
   "maxduration": 250.0,
   "mindeadair": 1.0,
   "maxdeadair": 3.0,
   "minfadeintime": 2.0,
   "maxfadeintime": 4.0,
   "minfadeouttime": 0.3,
   "maxfadeouttime": 1.0,
   "minpanpos": 0.0,
   "maxpanpos": 0.0,
   "minpanduration": 10.0,
   "maxpanduration": 20.0,
   "repeatrecordings": false,
   "active": true,
   "start_with_silence": false,
   "banned_duration": 600,
   "tag_filters": [],
   "project_id": 9
 }]


 asset looks like:

 {
  alt_text_loc_ids: []
  audio_length_in_seconds: 14.4
  created: "2019-03-13T20:09:34.237155"
  description: ""
  description_loc_ids: []
  end_time: 14.396
  envelope_ids: [6204]
  file: "https://prod.roundware.com/rwmedia/20190313-200933-43867.mp3"
  filename: "20190313-200933-43867.wav"
  id: 11511
  language_id: 1
  latitude: 42.4985662
  longitude: -71.2809467
  media_type: "audio"
  project_id: 27
  session_id: 43867
  shape: null
  start_time: 0
  submitted: true
  tag_ids: [290]
  updated: "2019-03-13T20:09:34.237155"
  user: null
  volume: 1
  weight: 50
  }

*/

//const LOGGABLE_AUDIO_ELEMENT_EVENTS = ['loadstart','playing','stalled','waiting']; // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#Events
const LOGGABLE_AUDIO_ELEMENT_EVENTS = [
  "pause",
  "play",
  "playing",
  "waiting",
  "stalled",
]; // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#Events

const LOGGABLE_HOWL_EVENTS = [
  "load",
  "loaderror",
  "playerror",
  "play",
  "end",
  "pause",
  "stop",
  "mute",
  "volume",
  "rate",
  "seek",
  "fade",
  "unlock",
];
const NEARLY_ZERO = 0.01; // webaudio spec says you can't use 0.0 as a value due to floating point math concerns

export class PlaylistAudiotrack {
  /**
   * id of audiotrack
   * @type {number}
   * @memberof PlaylistAudiotrack
   */
  trackId: number;

  timedAssetPriority: any;

  /**
   * @type {Playlist}
   * @memberof PlaylistAudiotrack
   */
  playlist: Playlist;
  playing: boolean;
  windowScope: Window;
  currentAsset: IDecoratedAsset | null;

  gainNode?: GainNode;

  trackOptions: TrackOptions;
  mixParams?: IMixParams;
  state?: ITrackStates;
  audio?: Howl;

  assetEnvelope?: AssetEnvelope;

  constructor({
    windowScope,
    audioData,
    playlist,
  }: {
    windowScope: Window;
    audioData: IAudioTrackData;
    playlist: Playlist;
  }) {
    this.trackId = audioData.id;
    this.timedAssetPriority = audioData.timed_asset_priority;
    this.playlist = playlist;
    this.playing = false;
    this.windowScope = windowScope;

    this.currentAsset = null;

    const trackOptions = new TrackOptions(
      (param) => getUrlParam(windowScope.location.toString(), param),
      audioData
    );
    this.trackOptions = trackOptions;
    this.mixParams = { timedAssetPriority: audioData.timed_asset_priority };
    this.setInitialTrackState();
  }

  makeAudio(src: string) {
    const audio = new Howl({
      src: [src],
      volume: 0, // as we are going to fadeIn,
      preload: true,
      html5: true,
    });

    LOGGABLE_HOWL_EVENTS.forEach((name) =>
      audio.on(name, () => console.log(`\t[${this} audio ${name} event]`))
    );

    // audio.on("play", () => {
    //   // @ts-ignore
    //   console.log(audio.stereo());
    // });
    audio.on("loaderror", () => this.onAudioError());
    audio.on("playerror", () => this.onAudioError());
    audio.on("end", () => this.onAudioEnded());

    return audio;
    // this.audioContext = Howler.ctx;
    // this.gainNode = Howler.masterGain;
  }

  setInitialTrackState() {
    this.state = makeInitialTrackState(this, this.trackOptions);
  }

  /**
   *
   * This will remove any eventlisteners attached to audio
   * @memberof PlaylistAudiotrack
   */
  clearEvents() {
    LOGGABLE_HOWL_EVENTS.forEach((e) => {
      this.audio?.off(e);
    });

    this.audio?.on("loaderror", () => this.onAudioError());
    this.audio?.on("playerror", () => this.onAudioError());
    this.audio?.on("end", () => this.onAudioEnded());
  }
  onAudioError(evt?: any) {
    console.warn(`\t[${this} audio error, skipping to next track]`, evt);
    this.setInitialTrackState();
  }

  onAudioEnded() {
    console.log(`\t[${this} audio ended event]`);
  }

  play() {
    console.log(`${timestamp} ${this}: ${this.state}`);
    if (!this.state)
      console.warn(`No Initial track state. call \`setInitialTrackState()\``);
    else this.state.play();
  }

  updateParams(params = {}) {
    this.mixParams = { ...this.mixParams, ...params };
    if (this.mixParams.listenerPoint && this.currentAsset?.locationPoint) {
      // if currently playing asset is far away then skip that asset;
      const priority = distanceFixedFilter()(this.currentAsset, this.mixParams);
      console.info("Current Asset in Range: ", priority);
      if (priority === false) this.skip();
    }
    if (this.state) this.state.updateParams(this.mixParams);
    else console.warn(`State is undefined!`);
  }

  setZeroGain() {
    this.audio?.volume(NEARLY_ZERO);
  }

  // exponentialRampToValueAtTime sounds more gradual for fading in
  fadeIn(fadeInDurationSeconds: number): boolean {
    const currentAsset = this.currentAsset;
    if (!currentAsset || !currentAsset.volume) {
      console.warn(`currentAsset is undefined!`);
      return false;
    }
    if (!this.audio) {
      console.warn("Cannot fadeIn on empty audio instance!");
      return false;
    }

    const randomVolume = this.trackOptions.randomVolume;

    const finalVolume = randomVolume * currentAsset.volume;

    try {
      if (this.audio.playing()) {
        this.audio!.fade(0, finalVolume, fadeInDurationSeconds * 1000);
        return true;
      }
      this.audio.volume(0);
      this.audio.play();
      this.audio.once("play", () => {
        debugLogger(
          `Fading In from ${0} to ${finalVolume} for ${fadeInDurationSeconds}`
        );
        this.audio!.fade(0, finalVolume, fadeInDurationSeconds * 1000);
      });
      return true;
    } catch (err) {
      console.warn(`${this} unable to fadeIn`, currentAsset, err);
      return false;
    }
  }

  /**
   * Schedules a Fade out and returns true if success
   *
   * @param {number} fadeOutDurationSeconds
   * @return {*}  {boolean}
   * @memberof PlaylistAudiotrack
   */
  fadeOut(fadeOutDurationSeconds: number): boolean {
    debugLogger(
      `Fading out from: ${this.audio?.volume()} for ${fadeOutDurationSeconds}`
    );
    if (!this.audio) return false;
    if (!this.audio?.playing()) {
      this.audio?.play();
      this.audio?.once("play", () => {
        this.audio?.fade(
          this.audio?.volume(),
          0,
          fadeOutDurationSeconds * 1000
        );
      });
      return true;
    }
    this.audio?.fade(this.audio?.volume(), 0, fadeOutDurationSeconds * 1000);
    return true;
  }

  /**
   *This will perform cleanup, get next asset to play and update/set the `src` property to current audio
   *
   * @return {*}  {(IAssetData | null)}
   * @memberof PlaylistAudiotrack
   */
  loadNextAsset(): IDecoratedAsset | null {
    let { audio, currentAsset, trackOptions } = this;

    if (currentAsset) {
      if (!currentAsset.playCount) currentAsset.playCount = 1;
      else currentAsset.playCount++;
      currentAsset.lastListenTime = new Date();
    }

    const newAsset = this.playlist.next(this);

    this.currentAsset = newAsset || null;

    if (newAsset) {
      const { file, start_time } = newAsset;
      console.log(`\t[loading next asset ${this}: ${file}]`);

      this.assetEnvelope = new AssetEnvelope(trackOptions, newAsset);
      if (typeof file !== "string") {
        return null;
      }
      const audio = this.makeAudio(file);
      audio.seek(start_time);
      // start from given start value
      this.audio = audio;
      return newAsset;
    }

    return null;
  }

  pause() {
    console.log(`${timestamp} pausing ${this}`);
    if (!this.state)
      return console.warn(`pause() was called on a undefined state!`);
    this.state.pause();
  }

  playAudio() {
    if (!this.audio?.playing()) {
      this.audio?.play();
    }
  }

  pauseAudio() {
    if (!this.audio?.playing()) return;
    this.audio?.pause();
  }

  /**
   *
   * Fade Out currently playing asset quickly and get nextAsset
   * @return {void}
   * @memberof PlaylistAudiotrack
   */
  skip(): void {
    this.fadeOut(0.5);
    setTimeout(() => {
      this.clearEvents(); // remove scheduled plays, fades, etc.
      this.audio?.stop(); // make sure audio is stopped to avoid overlapping
      const newState = makeInitialTrackState(this, this.trackOptions);
      this.transition(newState);
    }, 500);
  }

  replay() {
    const { state } = this;
    console.log(`Replaying ${this}`);
    if (state) state.replay();
  }

  transition(newState: ITrackStates) {
    const {
      state,
      playlist: { elapsedTimeMs },
    } = this;

    console.log(
      `${timestamp} ${this}: '${state}' ➜  '${newState}' (${(
        elapsedTimeMs / 1000
      ).toFixed(1)}s elapsed)`
    );

    if (!this.state) return console.warn(`Current state was undefined`);
    this.state.finish();
    this.state = newState;
    this.state.play();
  }

  toString() {
    return `Track #${this.trackId}`;
  }
}
