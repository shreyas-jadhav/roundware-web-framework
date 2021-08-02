/** Responsible for identifying the user to the Roundware server and retrieving an auth token **/

import { ApiClient } from "./api-client";
import { IUserResponse } from "./types/user";

export class User {
  /** Create a User
   * @param {Object} options - Various configuration parameters for this user
   * @param {apiClient} options.apiClient - the API client object to use for server API calls
   * @param {String} options.deviceId - this value distinguishes a particular user, who may be anonymous, to the server; by default we will fingerprint the browser to get this value, but you can supply your own value (useful if your app has a preexisting authorization scheme)
   * @param {String} [options.clientType = "web"]
   **/
  apiClient: ApiClient;
  deviceId: string;
  clientType: string;
  userName: string;
  constructor({
    apiClient,
    deviceId = "00000000000000",
    clientType = "web",
  }: {
    apiClient: ApiClient;
    deviceId: string;
    clientType: string;
  }) {
    // TODO need to try to persist deviceId as a random value that can partially serve as "a unique identifier generated by the client" that can
    // used to claim a anonymous user's contributions. Some ideas for implementation: https://clientjs.org/ and https://github.com/Valve/fingerprintjs2
    this.apiClient = apiClient;
    this.deviceId = deviceId;
    this.clientType = clientType;
    this.userName = "(unknown)";
  }

  /** @returns {String} human-readable representation of this user **/
  toString(): string {
    return `User ${this.userName} (deviceId ${this.deviceId})`;
  }

  /** Make an API call to associate the (possibly anonymous) application user with a Roundware user account.
   * Upon success, this function receives an auth token, which is passed onto the apiClient object.
   * @returns {Promise} represents the pending API call **/
  async connect(): Promise<IUserResponse | {}> {
    const data = {
      device_id: this.deviceId,
      client_type: this.clientType,
    };

    // TODO need to also handle auth failures

    try {
      const responseData: IUserResponse =
        await this.apiClient.post<IUserResponse>("/users/", data);
      this.userName = responseData.username;
      this.apiClient.authToken = responseData.token;
      return responseData;
    } catch (err) {
      console.error("Auth failure", err);
      return {};
    }
  }
}
