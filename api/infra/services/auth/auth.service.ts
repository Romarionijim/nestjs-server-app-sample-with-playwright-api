import { APIRequestContext } from "@playwright/test";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { ApiClient } from "api/infra/api-client";
import { UserDto } from "@backend";

export class AuthService extends ApiClient {
  public token: string;

  constructor(request: APIRequestContext) {
    super(request, BaseUrl.LOCAL_HOST);
  }

  async register(data: UserDto) {
    return await this.post(EndPoint.REGISTER, { data });
  }

  async login(credentials: { username: string, password: string }) {
    return await this.post(EndPoint.LOGIN, { data: credentials });
  }

  async getProfile(credentials: { username?: string, password?: string } = {}) {
    if (!this.token && credentials.username && credentials.password) {
      const response = await this.login(
        {
          username: credentials.username,
          password: credentials.password
        }
      );
      const { access_token } = await response.json();
      await this.setToken(access_token);
    }
    return await this.get(EndPoint.PROFILE);
  }
}