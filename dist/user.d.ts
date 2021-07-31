/** Responsible for identifying the user to the Roundware server and retrieving an auth token **/
import { IApiClient } from "./types/api-client";
import { IUser, IUserResponse } from "./types/user";
export declare class User implements IUser {
    /** Create a User
     * @param {Object} options - Various configuration parameters for this user
     * @param {apiClient} options.apiClient - the API client object to use for server API calls
     * @param {String} options.deviceId - this value distinguishes a particular user, who may be anonymous, to the server; by default we will fingerprint the browser to get this value, but you can supply your own value (useful if your app has a preexisting authorization scheme)
     * @param {String} [options.clientType = "web"]
     **/
    apiClient: IApiClient;
    deviceId: string;
    clientType: string;
    userName: string;
    constructor({ apiClient, deviceId, clientType, }: {
        apiClient: IApiClient;
        deviceId: string;
        clientType: string;
    });
    /** @returns {String} human-readable representation of this user **/
    toString(): string;
    /** Make an API call to associate the (possibly anonymous) application user with a Roundware user account.
     * Upon success, this function receives an auth token, which is passed onto the apiClient object.
     * @returns {Promise} represents the pending API call **/
    connect(): Promise<IUserResponse | {}>;
}
