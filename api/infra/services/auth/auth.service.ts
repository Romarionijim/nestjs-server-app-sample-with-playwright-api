import { APIRequestContext } from "@playwright/test";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { ApiClient } from "api/infra/api-client";
import { User } from "api/types/user/user.types";

export class AuthService extends ApiClient {

  constructor(request: APIRequestContext) {
    super(request, BaseUrl.LOCAL_HOST);
  }

  async register(data: User) {
    return await this.post(`${EndPoint.AUTH}/${EndPoint.REGISTER}`, { data });
  }

  async login(credentials: { username: string, password: string }) {
    return await this.post(`${EndPoint.AUTH}/${EndPoint.LOGIN}`, { data: credentials });
  }

  async getProfile() {
    return await this.get(`${EndPoint.AUTH}/${EndPoint.PROFILE}`, { isAuthRequired: true });
  }
}