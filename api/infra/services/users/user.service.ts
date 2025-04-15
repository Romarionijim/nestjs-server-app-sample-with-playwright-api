import { ApiClient } from "api/infra/api-client";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { User } from "api/types/user/user.types";

export class UsersService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(BaseUrl.LOCAL_HOST);
  }

  async getAllUsers(queryParams?: { [key: string]: string | number | boolean; }) {
    return await this.apiClient.get(EndPoint.USERS, { queryParams });
  }

  async getUser(id: number) {
    return await this.apiClient.get(`${EndPoint.USERS}/${id}`);
  }

  async createUser(user: User) {
    return await this.apiClient.post(EndPoint.USERS, {
      data: user,
      isAuthRequired: true
    });
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