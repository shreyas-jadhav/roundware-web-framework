import { ApiClient } from "./api-client";
import { GeoPosition } from "./geo-position";
import { Roundware } from "./roundware";
import { IAudioData } from "./types";
export declare class Envelope {
    _envelopeId: string;
    _sessionId: number | string;
    _apiClient: ApiClient;
    _geoPosition: GeoPosition;
    _roundware: Roundware;
    _assetId: string | undefined;
    /** Create an Envelope
     * @param {number} sessionId - identifies the session associated with this asset
     * @param {ApiClient} apiClient - the API client object to use for server API calls
     * @param {geoPosition} geoPosition -
     * @param  {Roundware} roundware - roundware object
     **/
    constructor(sessionId: number | string, apiClient: ApiClient, geoPosition: GeoPosition, roundware: Roundware);
    /** @returns {String} human-readable representation of this asset **/
    toString(): string;
    /** Create a new Envelope in the server to which we can attach audio recordings as assets
     * @returns {Promise} represents the pending API call **/
    connect(): Promise<void>;
    /** Sends an audio file to the server
     * @param {blob} audioData
     * @param {string} fileName - name of the file
     * @return {Promise} - represents the API call */
    upload(audioData: IAudioData, fileName: string, data?: {
        latitude?: number;
        longitude?: number;
        tag_ids?: string;
        media_type?: string;
    }): Promise<{
        detail: string;
    }>;
}
//# sourceMappingURL=envelope.d.ts.map