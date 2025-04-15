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
    const response = await this.post(`${EndPoint.AUTH}/${EndPoint.REGISTER}`, { data });
    const responseBody = await response.json();
    
    if (responseBody.access_token) {
      await this.setToken(responseBody.access_token);
    }
    
    return response;
  }

  async login(credentials: { username: string, password: string }) {
    const response = await this.post(`${EndPoint.AUTH}/${EndPoint.LOGIN}`, { data: credentials });
    const responseBody = await response.json();
    
    if (responseBody.access_token) {
      await this.setToken(responseBody.access_token);
    }
    
    return response;
  }

  async getProfile() {
    return await this.get(`${EndPoint.AUTH}/${EndPoint.PROFILE}`, { isAuthRequired: true });
  }
}