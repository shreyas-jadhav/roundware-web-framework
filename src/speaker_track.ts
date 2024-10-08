import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import {
  Coord,
  Feature,
  LineString,
  MultiPolygon,
  Point,
  Polygon,
  MultiLineString,
} from "@turf/helpers";
import lineToPolygon from "@turf/line-to-polygon";
// import pointToLineDistance from './vendor/turf/point-to-line-distance';
import pointToLineDistance from "@turf/point-to-line-distance";
import { IAudioContext } from "standardized-audio-context";
import { SpeakerStreamer } from "./players/SpeakerStreamer";
import { SpeakerPrefetchSyncPlayer } from "./players/SpeakerPrefetchSyncPlayer";
import { ISpeakerData, ISpeakerPlayer } from "./types/speaker";
import { speakerLog } from "./utils";
import { SpeakerConfig } from "./types/roundware";
import { SpeakerSyncStreamer } from "./players/SpeakerSyncStreamer";
import { Mixer } from "./mixer";
import { SpeakerPrefetchPlayer } from "./players/SpeakerPrefetchPlayer";
const convertLinesToPolygon = (shape: LineString | MultiLineString) =>
  lineToPolygon(shape);
const FADE_DURATION_SECONDS = 3;
const NEARLY_ZERO = 0.05;

/** A Roundware speaker under the control of the client-side mixer, representing 'A polygonal geographic zone within which an ambient audio stream broadcasts continuously to listeners.
 * Speakers can overlap, causing their audio to be mixed together accordingly.  Volume attenuation happens linearly over a specified distance from the edge of the Speaker’s defined zone.'
 * (quoted from https://github.com/loafofpiecrust/roundware-ios-framework-v2/blob/client-mixing/RWFramework/RWFramework/Playlist/Speaker.swift)
 * */
export class SpeakerTrack {
  speakerId: number;
  maxVolume: number;
  minVolume: number;
  attenuationDistanceKm: number;
  uri: string;

  listenerPoint: Point;
  attenuationBorderPolygon?: Feature<MultiPolygon | Polygon>;
  attenuationBorderLineString?: LineString;
  outerBoundary?: Feature<MultiPolygon | Polygon>;

  currentVolume: number;

  speakerData: ISpeakerData;

  soundId: number | undefined;
  player!: ISpeakerPlayer;
  audioContext: IAudioContext;
  config: SpeakerConfig;
  mixer: Mixer;

  constructor({
    audioContext,
    listenerPoint,
    data,
    config,
    mixer,
  }: {
    audioContext: IAudioContext;
    listenerPoint: Feature<Point>;
    mixer: Mixer;
    data: ISpeakerData;
    config: SpeakerConfig;
  }) {
    const {
      id: speakerId,
      maxvolume: maxVolume,
      minvolume: minVolume,
      attenuation_border,
      boundary,
      attenuation_distance: attenuationDistance,
      uri,
    } = data;
    this.mixer = mixer;
    this.audioContext = audioContext;
    this.config = config;
    this.speakerData = data;
    this.speakerId = speakerId;
    this.maxVolume = maxVolume;
    this.minVolume = minVolume;
    this.attenuationDistanceKm = attenuationDistance / 1000;
    this.uri = uri;

    this.listenerPoint = listenerPoint.geometry;

    if (attenuation_border) {
      this.attenuationBorderPolygon = convertLinesToPolygon(attenuation_border);
      this.attenuationBorderLineString = attenuation_border;
    }
    if (boundary) this.outerBoundary = convertLinesToPolygon(boundary);
    this.currentVolume = NEARLY_ZERO;
    this.initPlayer();
  }

  outerBoundaryContains(point: Coord) {
    return (
      this.outerBoundary && booleanPointInPolygon(point, this.outerBoundary)
    );
  }

  attenuationShapeContains(point: Coord) {
    return (
      this.attenuationBorderPolygon &&
      booleanPointInPolygon(point, this.attenuationBorderPolygon)
    );
  }

  attenuationRatio(atPoint: Coord) {
    if (!this.attenuationBorderLineString) return 0;

    const distToInnerShapeKm = pointToLineDistance(
      atPoint,
      this.attenuationBorderLineString,
      { units: "kilometers" }
    );
    const ratio = 1 - distToInnerShapeKm / this.attenuationDistanceKm;
    return ratio;
  }

  log(string: string) {
    speakerLog(`${this.speakerId}] ` + string);
  }
  calculateVolume() {
    const { listenerPoint } = this;

    let newVolume = this.currentVolume;
    if (!listenerPoint) {
      this.log("No listener point");
      newVolume = this.currentVolume;
    } else if (this.attenuationShapeContains(listenerPoint)) {
      this.log("In attenuation shape");
      newVolume = this.maxVolume;
    } else if (this.outerBoundaryContains(listenerPoint)) {
      this.log("In outer boundary");
      const range = this.maxVolume - this.minVolume;
      const volumeGradient =
        this.minVolume + range * this.attenuationRatio(listenerPoint);

      newVolume = volumeGradient;
    } else {
      this.log("Outside outer boundary");
      newVolume = this.minVolume;
    }

    // don't exceed values over 1.0
    if (newVolume > 1) newVolume = 1;
    return newVolume;
  }

  updateParams(isPlaying: boolean, opts: { listenerPoint?: Feature<Point> }) {
    if (
      opts &&
      opts.listenerPoint &&
      opts.listenerPoint.geometry &&
      opts.listenerPoint.geometry.coordinates
    ) {
      this.listenerPoint = opts.listenerPoint.geometry;
    }

    if (isPlaying == false) {
      this.player.fadeOutAndPause();
      return;
    }

    const newVolume = this.calculateVolume();

    if (newVolume < 0.05) {
      // allow to fade before pausing
      this.player.fadeOutAndPause();
    } else {
      this.player.log(`new volume ${newVolume}`);
      this.play();
      if (this.player.playing) this.updateVolume();
    }
  }

  /**
   * Updates / (Schedules a update to if not playing) volume to match speaker track configurations using the `fade()` function
   * @memberof SpeakerTrack
   */
  updateVolume() {
    const newVolume = this.calculateVolume();
    if (newVolume < 0.05) this.player.fadeOutAndPause();
    else this.player.fade(newVolume);
    this.currentVolume = newVolume;
    return newVolume;
  }

  get logline(): string {
    return `${this} (${this.uri})`;
  }

  play() {
    const newVolume = this.calculateVolume();
    if (newVolume < 0.05) return; // no need to play

    try {
      this.player.play().then((success) => {
        if (!success) {
          setTimeout(() => {
            this.play();
          }, 2000);
        }
      });
    } catch (err) {
      console.error("Unable to play", this.logline, err);
    }
  }

  pause() {
    try {
      this.player?.pause();
    } catch (err) {
      console.error("Unable to pause", this.logline, err);
    }
  }

  initPlayer() {
    const Player = (() => {
      if (this.config.sync && this.config.prefetch)
        return SpeakerPrefetchSyncPlayer;
      if (this.config.sync) return SpeakerSyncStreamer;
      if (this.config.prefetch) return SpeakerPrefetchPlayer;
      return SpeakerStreamer;
    })();

    console.log(`init player ${this.speakerId}: ${Player.name}`);
    this.player = new Player({
      audioContext: this.audioContext,
      id: this.speakerId,
      uri: this.uri,
      config: this.config,
    });

    this.player.audio.addEventListener("playing", () => {
      if (this.player.isSafeToPlay && this.mixer.playing) this.updateVolume();
    });
  }

  toString() {
    const { speakerId } = this;
    return `SpeakerTrack (${speakerId})`;
  }
}
