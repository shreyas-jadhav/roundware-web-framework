import { Coordinates, IGeoPosition, GeoPositionOptions } from "./types";
/** Responsible for tracking the user's position, when geo listening is enabled and the browser is capable
 * @property {Boolean} isEnabled - whether or not the geo positioning system is enabled and available
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation **/
export declare class GeoPosition implements IGeoPosition {
    /** Create a new GeoPosition.
     * @param {Object} navigator - provides access to geolocation system
     * @param {Object} options - parameters for initializing this GeoPosition
     * @param {Boolean} [options.geoListenMode = GeoListenMode.DISABLED] - whether or not to attempt to use geolocation
     * @param {Boolean} [options.defaultCoords] */
    private _navigator;
    private _initialGeolocationPromise;
    private defaultCoords;
    private _lastCoords;
    geolocation: Geolocation;
    isEnabled: boolean;
    updateCallback: CallableFunction;
    private _geoWatchID?;
    constructor(navigator: Window[`navigator`], options: GeoPositionOptions);
    disable(): void;
    /** @return {String} Human-readable representation of this GeoPosition **/
    toString(): string;
    /** @return {Object} coordinates - last known coordinates received from the geolocation system (defaults to latitude 1, longitude 1) **/
    getLastCoords(): Coordinates;
    connect(geoUpdateCallback: CallableFunction): void;
    /** Attempts to get an initial rough geographic location for the listener, then sets up a callback
     * to update the position.
     * @param {Function} geoUpdateCallback - object that should receive geolocation coordinate updates
     * @see isEnabled **/
    enable(): void;
    /** Allows you to wait on the progress of the .connect() behavior, attempting to get an initial
     * estimate of the user's position. Note that this promise will never fail - if we cannot get an
     * accurate estimate, we fall back to default coordinates (currently latitude 1, longitude 1)
     * @return {Promise} Represents the attempt to get an initial estimate of the user's position **/
    waitForInitialGeolocation(): Promise<Coordinates>;
}
