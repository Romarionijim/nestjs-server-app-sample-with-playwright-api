import { ApiClient } from "api/infra/api-client";
import { APIRequestContext } from "@playwright/test";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { User } from "api/types/user/user.types";
import { AuthService } from "../auth/auth.service";

export class UsersService {
  apiClient: ApiClient;
  authService: AuthService

  constructor(request: APIRequestContext) {
    this.apiClient = new ApiClient(request, BaseUrl.LOCAL_HOST);
    this.authService = new AuthService(request);
  }

  async getAllUsers(queryParams?: { [key: string]: string | number | boolean; }) {
    return await this.apiClient.get(EndPoint.USERS, { queryParams });
  }

  async getUser(id: number) {
    return await this.apiClient.get(`${EndPoint.USERS}/${id}`);
  }

  async createUser(
    user: User,
    {
      username = process.env.ADMIN_USER as string,
      password = process.env.ADMIN_PASSWORD as string,
    }: {
      username?: string;
      password?: string;
    } = {}
  ) {
    const token = await this.apiClient.getToken();

    if (!token) {
      const { access_token } = await this.authService.login({
        username: username,
        password: password
      })
      await this.apiClient.setToken(access_token)
    }

    return await this.apiClient.post(EndPoint.USERS, {
      data: user,
      isAuthRequired: true
    });
  }

  async updateUser(id: number, updatedFields: User) {
    const token = await this.apiClient.getToken();

    if (!token) {
      const { access_token } = await this.authService.login({
        username: updatedFields.username,
        password: updatedFields.password
      })
      await this.apiClient.setToken(access_token)
    }

    return await this.apiClient.put(`${EndPoint.USERS}/${id}`, {
      data: updatedFields,
      isAuthRequired: true
    });
  }

  async deleteUser(id: number, admin: {
    username?: string,
    password?: string
  } = {}
  ) {
    const token = await this.apiClient.getToken();

    if (!token) {
      const { access_token } = await this.authService.login({
        username: admin.username!,
        password: admin.password!
      })
      await this.apiClient.setToken(access_token)
    }

    return await this.apiClient.delete(`${EndPoint.USERS}/${id}`, {
      isAuthRequired: true
    });
  }

  private async ensureAuthenticated(admin: {
    username?: string,
    password?: string
  } = {}
  ) {
    const username = admin.username || process.env.ADMIN_USER as string;
    const password = admin.password || process.env.ADMIN_PASSWORD as string;

    const token = await this.apiClient.getToken();
    if (!token) {
      const { access_token } = await this.authService.login({ username, password })
      await this.apiClient.setToken(access_token);
    }
  }
}