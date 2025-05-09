import { APIRequestContext } from "@playwright/test";
import { AuthService } from "api/infra/services/auth/auth.service";
import { UsersService } from "api/infra/services/users/user.service";
import { MockData } from "api/utils/mocks/mocks";

export class ServiceFactory {
  authService: AuthService;
  userService: UsersService;
  mockData: MockData;

  constructor(public request: APIRequestContext) {
    this.authService = new AuthService(request);
    this.userService = new UsersService(request);
    this.mockData = new MockData();
  }
}
