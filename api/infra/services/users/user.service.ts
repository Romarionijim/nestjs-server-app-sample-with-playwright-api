import { ApiClient } from "api/infra/api-client";
import { APIRequestContext } from "@playwright/test";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { User } from "api/types/user/user.types";

export class UsersService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request, BaseUrl.LOCAL_HOST)
  }

  async getAllUsers(queryParams?: { [key: string]: string | number | boolean; }) {
    return await this.get(EndPoint.USERS, { queryParams });
  }

  async getUser(id: number) {
    return await this.get(`${EndPoint.USERS}/${id}`);
  }

  async createUser(user: User) {
    // Only admin users can create other users via the POST /users endpoint
    // We need to ensure we have an authenticated admin token for this request
    return await this.post(EndPoint.USERS, { 
      data: user, 
      isAuthRequired: true 
    });
  }

  async updateUser(id: number, updatedFields: User) {
    return await this.put(`${EndPoint.USERS}/${id}`, { data: updatedFields });
  }

  async deleteUser(id: number) {
    return await this.delete(`${EndPoint.USERS}/${id}`);
  }
}