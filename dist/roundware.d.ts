import { AssetPool } from "./assetPool";
import { Envelope } from "./envelope";
import { Mixer } from "./mixer";
import { Coordinates, IAssetData, IAudioData, ITimedAssetData, IUiConfig } from "./types";
import { IAudioTrackData } from "./types/audioTrack";
import { IRoundwareConstructorOptions } from "./types/roundware";
import { ISpeakerData } from "./types/speaker";
export * from "./assetFilters";
export { GeoListenMode } from "./mixer";
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
export declare class Roundware {
    readonly windowScope: Window;
    private _serverUrl;
    private _projectId;
    private _speakerFilters;
    private _assetFilters;
    private _listenerLocation;
    private _initialOptions;
    private _assetUpdateInterval;
    private _apiClient;
    private _user;
    private _geoPosition;
    private _session;
    private _project;
    private _speaker;
    private _asset;
    private _timed_asset;
    private _audiotrack;
    private _initialParams;
    private _mixer;
    private _onUpdateLocation;
    private _onUpdateAssets;
    private _assetData;
    private _onPlayAssets;
    private _sessionId;
    uiConfig: IUiConfig;
    private _speakerData;
    private _audioTracksData;
    private _lastAssetUpdate;
    private _timedAssetData;
    private _assetDataTimer;
    /** Initialize a new Roundware instance
     * @param {Object} windowScope - representing the context in which we are executing - provides references to window.navigator, window.console, etc.
     * @param {Object} options - Collection of parameters for configuring this Roundware instance
     * @param {String} options.serverUrl - identifies the Roundware server
     * @param {Number} options.projectId - identifies the Roundware project to connect
     * @param {Boolean} options.geoListenMode - whether or not to attempt to initialize geolocation-based listening
     * @throws Will throw an error if serveUrl or projectId are missing
      TODO need to provide a more modern/ES6-aware architecture here vs burdening the constructor with all of these details **/
    constructor(windowScope: Window, { serverUrl, projectId, speakerFilters, assetFilters, listenerLocation, user, geoPosition, session, project, speaker, asset, timedAsset, audiotrack, assetUpdateInterval, prefetchSpeakerAudio, ...options }: IRoundwareConstructorOptions);
    updateLocation(listenerLocation: Coordinates): void;
    set onUpdateLocation(callback: CallableFunction);
    set onUpdateAssets(callback: CallableFunction);
    set onPlayAssets(callback: CallableFunction);
    _triggerOnPlayAssets(): void;
    get currentlyPlayingAssets(): any[] | undefined;
    enableGeolocation(mode: number): void;
    disableGeolocation(): void;
    /** Initiate a connection to Roundware
     *  @return {Promise} - Can be resolved in order to get the audio stream URL, or rejected to get an error message; see example above **/
    connect(): Promise<{
        uiConfig: IUiConfig;
    }>;
    get mixParams(): {};
    getAssets(options: object): Promise<unknown[]>;
    get assetPool(): AssetPool | undefined;
    getAssetsFromPool(assetFilter: CallableFunction, extraParams?: {}): Promise<IAssetData[]>;
    updateAssetPool(): Promise<void>;
    loadAssetPool(): Promise<IAssetData[]>;
    activateMixer(activationParams?: {}): Promise<Mixer>;
    /** Create or resume the audio stream
     * @see Stream.play **/
    play(firstPlayCallback?: (value: Coordinates) => any): Promise<any>;
    /** Tell Roundware server to pause the audio stream. You should always call this when the local audio player has been paused.
     * @see Stream.pause **/
    pause(): void;
    /** Tell Roundware server to kill the audio stream.
     * @see Stream.kill **/
    kill(): void;
    /** Tell Roundware server to replay the current asset.
     * @see Stream.replay **/
    replay(): void;
    /** Tell Roundware server to skip the current asset.
     * @see Stream.skip **/
    skip(): void;
    /** Update the Roundware stream with new tag IDs
     * @param {string} tagIdStr - comma-separated list of tag IDs to send to the streams API **/
    tags(): void;
    /** Update the Roundware stream with new tag IDs and or geo-position
     * @param {object} data - containing keys latitude, longitude and tagIds **/
    update(data: {
        latitude: number;
        longitude: number;
        tagIds: string[] | number[];
    }): void;
    speakers(): ISpeakerData[];
    assets(): IAssetData[];
    timedAssets(): ITimedAssetData[] | [];
    audiotracks(): IAudioTrackData[] | [];
    /** Attach new assets to the project
     * @param {Object} audioData - the binary data from a recording to be saved as an asset
     * @param {string} fileName - name of the file
     * @return {promise} - represents the API calls to save an asset; can be tested to find out whether upload was successful
     * @see Envelope.upload */
    saveAsset(audioData: IAudioData, fileName: string, data: object): Promise<{
        detail: string;
    }>;
    /** Explicitly make a new envelope that you can attach multiple assets to by
     calling the `Envelope.upload` method. This is the main way to add text,
     photo, and video assets to an envelope. */
    makeEnvelope(): Promise<Envelope>;
    findTagDescription(tagId: string, tagType?: string): any;
    vote(assetId: string, voteType: string, value: unknown): Promise<unknown>;
    getAsset(id: string): Promise<IAssetData>;
    getEnvelope(id: string | number): Promise<unknown>;
}
//# sourceMappingURL=roundware.d.ts.map