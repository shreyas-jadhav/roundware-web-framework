import { ApiClient } from "./api-client";
/** Responsible for establishing a session with the Roundware server **/
export declare class Session {
    sessionId: number | undefined;
    /** Create a new Session
     * @param {object} navigator - provides access to the userAgent string
     * @param {Number} newProjectId - identifies the Roundware project to associate with this session
     * @param {Boolean} geoListenEnablement - whether the server should enable geo listening features
     * @param {Object} options - Various configuration parameters for this session
     * @param {apiClient} options.apiClient - the API client object to use for server API calls
     **/
    constructor(navigator: Window[`navigator`], newProjectId: number, geoListenEnablement: boolean, options: {
        apiClient: ApiClient;
    });
    /** @returns {String} human-readable representation of this session **/
    toString(): string;
    /** Make an asynchronous API call to establish a session with the Roundware server
     * @return {Promise} sessionId
     **/
    connect(): Promise<number>;
}
//# sourceMappingURL=session.d.ts.map