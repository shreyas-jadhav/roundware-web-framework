import { ApiClient } from "./api-client";
import { Asset } from "./asset";
import { ASSET_PRIORITIES } from "./assetFilters";
import { AssetPool } from "./assetPool";
import { Audiotrack } from "./audiotrack";
import { noAssetData } from "./constants/warning";
import { Envelope } from "./envelope";
import {
  InvalidArgumentError,
  MissingArgumentError,
  RoundwareConnectionError,
  RoundwareFrameworkError,
} from "./errors/app.errors";
import { RoundwareEvents } from "./events";
import { GeoPosition } from "./geo-position";
import { GeoListenMode, Mixer } from "./mixer";
import { Project } from "./project";
import { Session } from "./session";
import { logger } from "./shims";
import { Speaker } from "./speaker";
import { TimedAsset } from "./timed_asset";

import {
  Coordinates,
  GeoListenModeType,
  IAudioData,
  IInitialParams,
  IMixParams,
  ITimedAssetData,
  IUiConfig,
} from "./types";
import { IAssetFilters } from "./types/asset";
import { IAssetData } from "./types/asset";
import { IAudioTrackData } from "./types/audioTrack";
import { IEnvelopeData } from "./types/envelope";
import { IOptions, IRoundwareConstructorOptions } from "./types/roundware";
import { ISpeakerData, ISpeakerFilters } from "./types/speaker";
import { User } from "./user";

export * from "./assetFilters";
export { GeoListenMode } from "./mixer";

import { multiPolygon, featureCollection } from "@turf/helpers";
import bbox from "@turf/bbox";
import buffer from "@turf/buffer";
import { ListenHistory } from "./listenHistory";
/** This class is the primary integration point between Roundware's server and your application

   @example
   var roundwareServerUrl = "http://localhost:8888/api/2";
   var roundwareProjectId = 1;

   var roundware = new Roundware(window,{
     serverUrl: roundwareServerUrl,
     projectId: roundwareProjectId
   });

   function ready() {
     console.info("Connected to Roundware Server. Ready to play.");
     // this is a good place to initialize audio player controls, etc.
   }

   // Generally we throw user-friendly messages and log a more technical message
   function handleError(userErrMsg) {
     console.error("Roundware Error: " + userErrMsg);
   }

  roundware.connect().
    then(ready).
    catch(handleError);

  function startListening(streamURL) {
    console.info("Loading " + streamURL);
    // good place to connect your audio player to the audio stream
  }

  roundware.play(startListening).catch(handleError);
**/

export class Roundware {
  private _serverUrl: string;
  private _projectId: number;
  private _speakerFilters: ISpeakerFilters = {};
  private _assetFilters: IAssetFilters;
  listenerLocation: Coordinates;
  private _initialOptions: IOptions;
  private _assetUpdateInterval: number;
  apiClient: ApiClient;

  user: User;
  geoPosition: GeoPosition;
  private _session: Session;
  project: Project;
  private _speaker: Speaker;
  private _asset: Asset;
  private _timed_asset: TimedAsset;
  private _audiotrack: Audiotrack;
  mixer: Mixer;
  private _onUpdateLocation: CallableFunction = () => {};
  private _onUpdateAssets: CallableFunction = () => {};
  assetData: IAssetData[] | null = null;
  private _onPlayAssets: CallableFunction = () => {};
  private _sessionId: number | undefined;
  uiConfig: IUiConfig = {};
  private _speakerData: ISpeakerData[] = [];
  private _audioTracksData: IAudioTrackData[] | null = null;
  private _lastAssetUpdate: Date | undefined;
  timedAssetData: ITimedAssetData[] | null = null;
  private _assetDataTimer: NodeJS.Timeout | undefined;
  listenHistory: ListenHistory;
  events?: RoundwareEvents;
  /** Initialize a new Roundware instance
   * @param {Object} windowScope - representing the context in which we are executing - provides references to window.navigator, window.console, etc.
   * @param {Object} options - Collection of parameters for configuring this Roundware instance
   * @param {String} options.serverUrl - identifies the Roundware server
   * @param {Number} options.projectId - identifies the Roundware project to connect
   * @param {number} options.geoListenMode - whether or not to attempt to initialize geolocation-based listening
   * @throws Will throw an error if serveUrl or projectId are missing
    TODO need to provide a more modern/ES6-aware architecture here vs burdening the constructor with all of these details **/

  constructor(options: IRoundwareConstructorOptions) {
    if (typeof options !== "object")
      throw new MissingArgumentError(
        `options`,
        `instantiating Roundware`,
        `IRoundwareConstructorOptions`
      );

    const {
      serverUrl,
      projectId,
      speakerFilters,
      assetFilters,
      listenerLocation,
      user,
      geoPosition,
      session,
      project,
      speaker,
      asset,
      timedAsset,
      audiotrack,
      assetUpdateInterval,
    } = options;

    if (typeof serverUrl !== "string") {
      throw new InvalidArgumentError(
        `options.serverUrl`,
        `string`,
        `instantiating Roundware`
      );
    }

    if (typeof projectId !== "number") {
      throw new InvalidArgumentError(
        `options.serverUrl`,
        `string`,
        `instantiating Roundware`
      );
    }

    this._serverUrl = serverUrl;
    this._projectId = projectId;
    if (speakerFilters) this._speakerFilters = speakerFilters;
    this._assetFilters = assetFilters;
    if (
      typeof listenerLocation.longitude !== "number" &&
      typeof listenerLocation.latitude !== "number"
    )
      throw new InvalidArgumentError(
        `options.listenerLocation`,
        `Coordinates`,
        `instantiating Roundware`
      );
    this.listenerLocation = listenerLocation;
    this._initialOptions = options;
    // By default, update the asset pool every 5 minutes.
    this._assetUpdateInterval = assetUpdateInterval || 300000;

    this.apiClient = new ApiClient(this._serverUrl);

    const newOptions: Required<IOptions> = options as Required<IOptions>;
    newOptions.apiClient = this.apiClient;

    let navigator = window.navigator;

    // TODO need to reorganize/refactor these classes
    this.user =
      user ||
      new User({
        apiClient: newOptions.apiClient,
        clientType: newOptions.clientType,
        deviceId: newOptions.deviceId,
      });
    this.geoPosition =
      geoPosition ||
      new GeoPosition(navigator, {
        geoListenMode: newOptions.geoListenMode,
        defaultCoords: listenerLocation,
      });
    this._session =
      session ||
      new Session(navigator, this._projectId, this.geoPosition.isEnabled, {
        apiClient: this.apiClient,
      });

    this.project = project || new Project(this._projectId, newOptions);
    this._speaker = speaker || new Speaker(this._projectId, newOptions);
    this._asset = asset || new Asset(this._projectId, newOptions);
    if (!this._asset)
      throw new RoundwareFrameworkError(
        "Failed to connect to assets! Please try again."
      );
    this._timed_asset =
      timedAsset || new TimedAsset(this._projectId, newOptions);
    this._audiotrack =
      audiotrack || new Audiotrack(this._projectId, newOptions);
    this.uiConfig = {};

    const mixParams: IMixParams = {
      ...this.mixParams,
      ...this._initialOptions,
    };
    this.mixer = new Mixer({
      client: this,

      listenerLocation: this.listenerLocation,
      mixParams,
    });
    this.listenHistory = new ListenHistory();
  }

  updateLocation(listenerLocation: Coordinates): void {
    // when location is different log event
    if (
      this.listenerLocation.latitude != listenerLocation.latitude ||
      this.listenerLocation.longitude != listenerLocation.longitude
    ) {
      this.events?.logEvent(`location_update`, listenerLocation);
    }

    this.listenerLocation = listenerLocation;

    this.mixer.updateParams({ listenerLocation });

    if (this._onUpdateLocation) this._onUpdateLocation(listenerLocation);
  }

  set onUpdateLocation(callback: (lastCoords: Coordinates) => any) {
    this._onUpdateLocation = callback;

    const lastCoords = this.geoPosition.getLastCoords();
    callback(lastCoords);
  }

  set onUpdateAssets(callback: (assets?: IAssetData[]) => any) {
    this._onUpdateAssets = callback;

    if (this.assetData) {
      callback(this.assets());
    }
  }

  set onPlayAssets(callback: (currentlyPlaylingAssets?: IAssetData[]) => any) {
    this._onPlayAssets = callback;
    callback(this.currentlyPlayingAssets);
  }

  triggerOnPlayAssets() {
    if (typeof this._onPlayAssets == "function") {
      this._onPlayAssets(this.currentlyPlayingAssets);
    }
  }

  get currentlyPlayingAssets(): IAssetData[] | undefined {
    if (!this.mixer.playlist) {
      return [];
    }
    return this.mixer.playlist.currentlyPlayingAssets;
  }

  enableGeolocation(mode: GeoListenModeType): void {
    if (mode === GeoListenMode.AUTOMATIC) {
      this.geoPosition.enable();
    } else {
      this.geoPosition.disable();
    }
    this.mixer.updateParams({ geoListenMode: mode });
  }

  disableGeolocation(): void {
    this.geoPosition.disable();
    this.mixer.updateParams({ geoListenMode: GeoListenMode.DISABLED });
  }

  /** Initiate a connection to Roundware
   *  @return {Promise} - Can be resolved in order to get the audio stream URL, or rejected to get an error message; see example above **/
  async connect(): Promise<{ uiConfig: IUiConfig }> {
    try {
      // want to start this process as soon as possible, as it can take a few seconds
      this.geoPosition.connect((newLocation: Coordinates) =>
        this.updateLocation(newLocation)
      );

      logger.info(`Initializing Roundware for project ID ${this._projectId}`);

      await this.user?.connect();
      const sessionId = await this._session.connect();

      this._sessionId = sessionId;

      this.events = new RoundwareEvents(this._sessionId, this.apiClient);

      this.events.logEvent(`start_session`);

      const promises: [
        Promise<number | undefined>,
        Promise<IUiConfig>,
        Promise<ISpeakerData[]>,
        Promise<IAudioTrackData[]>
      ] = [
        this.project.connect(sessionId),
        this.project
          .uiconfig(sessionId)
          .then((uiConfig) => (this.uiConfig = uiConfig)),
        this._speaker
          .connect(this._speakerFilters)
          .then((speakerData) => (this._speakerData = speakerData)),
        this._audiotrack
          .connect()
          .then((audioTracksData) => (this._audioTracksData = audioTracksData)),
      ];

      await Promise.all(promises);
      console.info("Roundware connected");
      return { uiConfig: this.uiConfig };
    } catch {
      throw new RoundwareConnectionError();
    }
  }

  get mixParams() {
    return (this.project || {}).mixParams;
  }

  /// Requests list of assets from the server given some filters.
  async getAssets(options?: IAssetFilters): Promise<IAssetData[]> {
    // If the caller just wants all assets, pass back the preloaded list.
    if (!options && this.assetData) {
      return this.assetData;
    } else {
      return await this.apiClient.get<IAssetData[]>(`/assets/`, {
        project_id: this._projectId,
        // Override default filters with unknown passed in options.
        ...this._assetFilters,
        ...(options || {}),
      });
    }
  }

  get assetPool(): AssetPool | undefined {
    return this.mixer.assetPool;
  }

  /// Returns a reduced asset list by filtering the overall pool.
  /// Example: `getAssetsFromPool(allAssetFilter([distanceRangesFilter(), anyTagsFilter()]))`
  async getAssetsFromPool(
    assetFilter: (asset: IAssetData, mixParams: IMixParams) => boolean,
    extraParams: IMixParams = {}
  ): Promise<IAssetData[]> {
    const pool = await this.loadAssetPool();
    const mixParams = { ...this.mixParams, ...extraParams };

    return pool.filter(
      (a) => assetFilter(a, mixParams) != ASSET_PRIORITIES.DISCARD
    );
  }

  async updateAssetPool(): Promise<void> {
    let filters = this._assetFilters;
    let existingAssets: IAssetData[] = [];
    if (this._lastAssetUpdate) {
      filters = {
        ...filters,
        created__gte: this._lastAssetUpdate.toISOString(),
      };
      existingAssets = this.assets();
    }

    const newAssets = existingAssets.concat(await this._asset.connect(filters));
    if (newAssets.length !== this.assetData?.length) {
      this.assetData = newAssets;
      if (typeof this._onUpdateAssets == "function") {
        this._onUpdateAssets(this.assetData);
      }
    }

    // also fetch timedAssetData if not available
    if (!Array.isArray(this.timedAssetData)) {
      this.timedAssetData = await this._timed_asset.connect({});
    }

    this._lastAssetUpdate = new Date();

    // Update the mixer's asset pool, if any.
    const pool = this.assetPool;
    if (pool && Array.isArray(this.timedAssetData)) {
      pool.updateAssets(this.assetData, this.timedAssetData);
    }

    Promise.resolve();
  }

  async loadAssetPool(): Promise<IAssetData[]> {
    // fetch timedAssetData before updating assetPool
    if (!Array.isArray(this.timedAssetData)) {
      this.timedAssetData = await this._timed_asset.connect({});
    }

    // Options passed here should only need to go into the assets/ call.
    if (!this.assetData) {
      await this.updateAssetPool();
      // Setup periodic retrieval of newly uploaded assets.
      this._assetDataTimer = setInterval(
        () => this.updateAssetPool(),
        this._assetUpdateInterval
      );
    }

    return this.assetData!; // it's alway going to be an array as we update assetPool
  }
  /**
   * Updates params with passed params, Builds playlist instance, loads assetPool
   * @param  {IMixParams} activationParams
   * @returns Mixer
   */
  async activateMixer(activationParams: IMixParams = {}): Promise<Mixer> {
    // Make sure the asset pool is loaded.
    await this.loadAssetPool();

    const allMixParams = {
      ...this._initialOptions,
      ...this.mixParams,
      ...activationParams,
      sessionId: this._sessionId,
    };

    this.mixer.initContext();
    this.mixer.updateParams(allMixParams);

    return this.mixer;
  }

  /** Create or resume the audio stream
   * @see Mixer.toogle **/
  play(firstPlayCallback: (value: Coordinates) => any = () => {}) {
    console.log("Playing...");
    return this.geoPosition.waitForInitialGeolocation().then(firstPlayCallback);
  }

  /** Tell Roundware server to pause the audio stream. You should always call this when the local audio player has been paused.
   * @see Mixer.playlist.pause **/
  pause() {
    if (this.mixer.playlist) {
      this.mixer.playlist.pause();
    }
  }

  /** Tell Roundware server to kill the audio stream.
   * @see Stream.kill **/
  kill() {}

  /** Tell Roundware server to replay the current asset.
   * @see Stream.replay **/
  replay() {}

  /** Tell Roundware server to skip the current asset.
   * @see Stream.skip **/
  skip() {
    if (this.mixer.playlist) {
      this.mixer.playlist.skip();
    }
  }

  /** Update the Roundware stream with new tag IDs
   * @param {string} tagIdStr - comma-separated list of tag IDs to send to the streams API **/
  tags() {}

  /** Update the Roundware stream with new tag IDs and or geo-position
   * @param {object} data - containing keys latitude, longitude and tagIds **/
  update(data: {
    latitude: number;
    longitude: number;
    tagIds: string[] | number[];
  }) {
    if (this.mixer.playlist) {
      this.mixer.playlist.updateParams(data);
    }
    // Object.keys(data).map(e => console.log(`key=${e}  value=${data[e]}`));
  }

  speakers(): ISpeakerData[] {
    return this._speakerData || [];
  }

  assets(): IAssetData[] {
    if (!this.assetData) console.warn(noAssetData);
    return this.assetData || [];
  }

  timedAssets(): ITimedAssetData[] | [] {
    if (!this.timedAssetData) console.warn(noAssetData);
    return this.timedAssetData || [];
  }

  audiotracks(): IAudioTrackData[] | [] {
    return this._audioTracksData || [];
  }

  /** Attach new assets to the project
   * @param {Object} audioData - the binary data from a recording to be saved as an asset
   * @param {string} fileName - name of the file
   * @return {promise} - represents the API calls to save an asset; can be tested to find out whether upload was successful
   * @see Envelope.upload */
  async saveAsset(audioData: IAudioData, fileName: string, data: object) {
    const envelope = await this.makeEnvelope();
    return envelope.upload(audioData, fileName, data);
  }

  /** Explicitly make a new envelope that you can attach multiple assets to by
   calling the `Envelope.upload` method. This is the main way to add text,
   photo, and video assets to an envelope. */
  async makeEnvelope(): Promise<Envelope> {
    if (!this._sessionId) {
      throw new Error(
        "can't save assets without first connecting to the server"
      );
    }

    let envelope = new Envelope(
      this._sessionId,
      this.apiClient,
      this.geoPosition,
      this
    );

    await envelope.connect();
    return envelope;
  }

  findTagDescription(tagId: number, tagType = "listen") {
    const tagGroups = this.uiConfig[tagType]!;
    for (const group of tagGroups) {
      for (const item of group.display_items) {
        if (item.tag_id == tagId) {
          return item.tag_display_text;
        }
      }
    }
    return undefined;
  }

  async vote(
    assetId: number,
    voteType: string,
    value?: unknown
  ): Promise<void> {
    return this.apiClient.post(`/assets/${assetId}/votes/`, {
      session_id: this._sessionId,
      vote_type: voteType,
      value,
    });
  }

  /// @return Detailed information about a particular asset.
  async getAsset(id: number): Promise<IAssetData> {
    // Check for this asset in any already loaded asset pool.
    if (this.assetData) {
      for (const asset of this.assetData) {
        if (asset.id === id) {
          return asset;
        }
      }
    }
    // Otherwise, ask the server for the asset details.
    return this.apiClient.get<IAssetData>(`/assets/${id}/`, {
      session_id: this._sessionId,
    });
  }

  /// @return Details about a particular envelope (which may contain multiple assets).
  async getEnvelope(id: number): Promise<IEnvelopeData> {
    return this.apiClient.get<IEnvelopeData>(`/envelopes/${id}`, {
      session_id: this._sessionId,
    });
  }

  /**
   *
   * Calculates bounds for the map based on Speakers
   * @memberof Roundware
   */
  getMapBounds(): {
    southwest: Coordinates;
    northeast: Coordinates;
  } {
    const speakersHavingShape = this.speakers().filter(
      (speaker) => !!speaker.shape
    ) as (ISpeakerData & Required<Pick<ISpeakerData, `shape`>>)[];
    // get polygons from all speakers
    const polygons = speakersHavingShape.map((s) =>
      multiPolygon(s.shape.coordinates)
    );
    let polygonCollection = featureCollection(polygons);

    // add buffer
    this.project.outOfRangeDistance &&
      (polygonCollection = buffer(
        polygonCollection,
        this.project.outOfRangeDistance,
        { units: "meters" }
      ));

    // order - [minX, minY, maxX, maxY]
    const [swLng, swLat, neLng, neLat] = bbox(polygonCollection);

    return {
      southwest: {
        latitude: swLat,
        longitude: swLng,
      },
      northeast: {
        latitude: neLat,
        longitude: neLng,
      },
    };
  }
}
