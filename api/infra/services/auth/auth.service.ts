import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { ApiClient } from "api/infra/api-client";
import { User } from "api/types/user/user.types";

export class AuthService extends ApiClient {

  constructor() {
    super(BaseUrl.LOCAL_HOST);
  }

  async register(data: User) {
    return await this.post(EndPoint.REGISTER, { data });
  }

  async login(credentials: { username: string, password: string }) {
    return await this.post(EndPoint.LOGIN, { data: credentials });
  }

  async getProfile(credentials: { username?: string, password?: string } = {}) {
    const isAuthenticated = await this.isAuthenticated();
    if (!isAuthenticated && credentials.username && credentials.password) {
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