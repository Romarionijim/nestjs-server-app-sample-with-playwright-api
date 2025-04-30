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
    userToCreate: User,
    adminUser?: User
  ) {

    if (adminUser) {
      await this.ensureAuthenticated(adminUser);
    }

    return await this.apiClient.post(EndPoint.USERS, {
      data: userToCreate,
      isAuthRequired: true
    });
  }

  async updateUser(
    id: number,
    updatedFields: User,
    adminUser?: User
  ) {

    if (adminUser) {
      await this.ensureAuthenticated(adminUser);
    }

    return await this.apiClient.put(`${EndPoint.USERS}/${id}`, {
      data: updatedFields,
      isAuthRequired: true
    });
  }

  async deleteUser(
    id: number,
    admin: User
  ) {
    await this.ensureAuthenticated(admin);

    return await this.apiClient.delete(`${EndPoint.USERS}/${id}`, {
      isAuthRequired: true
    });
  }

  private async ensureAuthenticated(user: User) {
    const username = user.username
    const password = user.password

    const userResponse = await this.getAllUsers({ username });
    const userData = await userResponse.json();

    if (!userData[0]) {
      await this.authService.register(user);
    }
    const token = await this.apiClient.getToken();
    if (!token) {
      const { access_token } = await this.authService.login({
        username,
        password
      });
      await this.apiClient.setToken(access_token);
    }
  }
}