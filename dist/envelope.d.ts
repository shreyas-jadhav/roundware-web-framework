import { IApiClient } from "./types/api-client";
import { IRoundware } from "./types/roundware";
import { IEnvelope } from "./types/envelope";
import { IGeoPosition, IAudioData } from "./types";
export declare class Envelope implements IEnvelope {
    _envelopeId: string;
    _sessionId: number | string;
    _apiClient: IApiClient;
    _geoPosition: IGeoPosition;
    _roundware: IRoundware;
    _assetId: string | undefined;
    /** Create an Envelope
     * @param {number} sessionId - identifies the session associated with this asset
     * @param {ApiClient} apiClient - the API client object to use for server API calls
     * @param {geoPosition} geoPosition -
     **/
    constructor(sessionId: number | string, apiClient: IApiClient, geoPosition: IGeoPosition, roundware: IRoundware);
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
