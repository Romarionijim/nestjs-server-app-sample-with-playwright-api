import { APIRequestContext } from "@playwright/test";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { ApiClient } from "api/infra/api-client";
import { User } from "api/types/user/user.types";

export class AuthService {
  apiClient: ApiClient;

  constructor(request: APIRequestContext) {
    this.apiClient = new ApiClient(request, BaseUrl.LOCAL_HOST);
  }

  async register(data: User) {
    const response = await this.apiClient.post(`${EndPoint.AUTH}/${EndPoint.REGISTER}`, { data });
    const { access_token, ...responseBody } = await response.json();

    if (!access_token) {
      throw new Error('Access token was not provided by the server when registering a user!');
    }

    await this.apiClient.setToken(access_token);

    return {
      response,
      body: responseBody,
      access_token: access_token
    }
  }

  async login(credentials: { username: string, password: string }) {
    const response = await this.apiClient.post(
      `${EndPoint.AUTH}/${EndPoint.LOGIN}`,
      { data: credentials }
    );
    const { access_token, ...responseBody } = await response.json();

    if (!access_token) {
      throw new Error('Access token was not provided by the server on login!')
    }

    await this.apiClient.setToken(access_token);

    return {
      response,
      body: responseBody,
      access_token: access_token
    }
  }

  async getProfile() {
    return await this.apiClient.get(
      `${EndPoint.AUTH}/${EndPoint.PROFILE}`,
      { isAuthRequired: true }
    );
  }
}