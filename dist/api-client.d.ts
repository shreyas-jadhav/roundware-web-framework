import { IApiClient, ApiClientOptions } from "./types/api-client";
export declare class ApiClient implements IApiClient {
    /** Create a new ApiClient
     * @param {String} baseServerUrl - identifies the Roundware server to receive API requests
     * @param {Boolean} [options.fetch = fetch] - for testing purposes, you can inject the fetch mechanism to use for making network requests **/
    private _jQuery;
    private _serverUrl;
    private _authToken;
    constructor(window: Window, baseServerUrl: string);
    /** Make a GET request to the Roundware server
     * @param {String} path - the path for your API request, such as "/streams/"
     * @param {Object} options - see the "send" method
     * @see {send} **/
    get<T>(path: string, data: object, options?: ApiClientOptions): Promise<T>;
    /** Make a POST request to the Roundware server
     * @param {String} path - the path for your API request, such as "/streams/"
     * @param {Object} options - see the "send" method
     * @see {send} **/
    post<T>(path: string, data: object, options?: ApiClientOptions): Promise<T>;
    /** Make a PATCH request to the Roundware server
     * @param {String} path - the path for your API request, such as "/streams/"
     * @param {Object} options - see the "send" method
     * @see {send} **/
    patch<T>(path: string, data: object, options?: ApiClientOptions): Promise<T>;
    /** Transmit an Ajax request to the Roundware API. Note that the Roundware Server expects paths to end with a trailing slash: /sessions/ instead of /sessions
     * @param path {string} - identifies the endpoint to receive the request
     * @param data {object} - the payload to send
     * @param urlOptions {object} - any additional options to add to the URL
     * @return {Promise} - will resolve or reject depending on the status of the request
     * @todo might be a good place to implement exponential retry of certain types of errors
     * @todo as of 2019, the fetch() polyfills are good enough that we should be able to get rid of JQuery dependency
     * **/
    send<T>(path: string, data: {
        [key: string]: any;
    } | undefined, urlOptions: ApiClientOptions): Promise<T>;
    /** Set the authorization token to use as the header for future API requests. Most Roundware API calls require an auth token to be set.
     * @param {String} authToken - characters to use in the authorization header **/
    set authToken(tokenStr: string);
}
