import { expect } from '@playwright/test';
import {
  test,
  StatusCode,
  TestTags,
  User
} from '@api-infra';

test.describe('Authentication api tests', { tag: TestTags.AUTH }, async () => {
  let adminUser: User;

  test.beforeEach(async ({ mockUser }) => {
    adminUser = {
      ...mockUser,
      roles: ['admin']
    }
  })
  test('should register user and login user', async ({ authenticationService }) => {
    await test.step('should register and create user successfully - [POST] /auth/register', async () => {
      const response = await authenticationService.register(adminUser);
      await expect(response.response).toBeOK();
      expect(response.response.status()).toBe(StatusCode.CREATED);
      expect(response.access_token).toBeDefined();
      expect(response.access_token).toBeTruthy();
      expect(response.body.message).toBe('registered in successfully!');
      expect(response.body.name).toBe(adminUser.name);
      expect(response.body.lastName).toBe(adminUser.lastName);
    });

    await test.step('should login with created credentials successfully - [POST] /auth/login', async () => {
      const response = await authenticationService.login({
        username: adminUser.username,
        password: adminUser.password
      });
      await expect(response.response).toBeOK();
      expect(response.access_token).toBeDefined();
      expect(response.access_token).toBeTruthy();
      expect(response.body.message).toBe('logged in successfully!');
    })

    await test.step('should navigate to my profile authenticated as an admin - [GET] /auth/profile', async () => {
      const response = await authenticationService.getProfile();
      const responseBody = await response.json();
      expect(responseBody.roles).toStrictEqual(['admin']);
      expect(responseBody.iat).toBeTruthy();
      expect(responseBody.exp).toBeTruthy();
    });
  });
})