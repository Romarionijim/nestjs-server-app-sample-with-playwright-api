import { AuthService } from "api/infra/services/auth/auth.service";
import { UsersService } from "api/infra/services/users/user.service"
import { test as base } from '@playwright/test';

type TestFixtures = {
  usersService: UsersService;
  authService: AuthService;
}

export const serviceFixture = base.extend<TestFixtures>({
  usersService: async ({ request }, use) => {
    await use(new UsersService(request))
  },
  authService: async ({ request }, use) => {
    await use(new AuthService(request))
  }
})

