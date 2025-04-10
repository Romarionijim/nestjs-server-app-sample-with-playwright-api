import { ApiClient } from "api/infra/api-client";
import { APIRequestContext } from "@playwright/test";
import { BaseUrl } from "api/enums/application-urls.enum";
import { EndPoint } from "api/enums/endpoints.enum";
import { UserDto } from "src/users/dto/users.dto";

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

  async createUser(userDto: UserDto) {
    return await this.post(EndPoint.USERS, { data: userDto })
  }

  async updateUser(id: number, updatedFields: UserDto) {
    return await this.put(`${EndPoint.USERS}/${id}`, { data: updatedFields });
  }

  async deleteUser(id: number) {
    return await this.delete(`${EndPoint.USERS}/${id}`);
  }
}