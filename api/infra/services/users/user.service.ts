import { ApiClient } from "api/infra/api-client";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { User } from "api/types/user/user.types";

export class UsersService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(BaseUrl.LOCAL_HOST);
  }

  async authenticate(username: string, password: string) {
    const response = await this.apiClient.post(EndPoint.LOGIN, {
      data: { username, password },
      isAuthRequired: true
    });
    const { access_token } = await response.json();
    await this.apiClient.setToken(access_token);
    return access_token;
  }

  async register(user: User) {
    return await this.apiClient.post(EndPoint.REGISTER, {
      data: user,
      isAuthRequired: true
    });
  }

  async getAllUsers(queryParams?: { [key: string]: string | number | boolean; }) {
    return await this.apiClient.get(EndPoint.USERS, { queryParams });
  }

  async getUser(id: number) {
    return await this.apiClient.get(`${EndPoint.USERS}/${id}`);
  }

  async createUser(user: User, adminCredentials?: { username: string, password: string }) {
    if (adminCredentials !== undefined) {
      const adminUser = {
        ...user,
        username: adminCredentials.username,
        password: adminCredentials.password
      };
      
      return await this.apiClient.post(EndPoint.USERS, {
        data: adminUser,
        isAuthRequired: true
      });
    } else {
      return await this.apiClient.post(EndPoint.USERS, {
        data: user,
        isAuthRequired: true
      });
    }
  }

  async updateUser(id: number, updatedFields: User) {
    return await this.apiClient.put(`${EndPoint.USERS}/${id}`, {
      data: updatedFields,
      isAuthRequired: true
    });
  }

  async deleteUser(id: number) {
    return await this.apiClient.delete(`${EndPoint.USERS}/${id}`, {
      isAuthRequired: true
    });
  }
}