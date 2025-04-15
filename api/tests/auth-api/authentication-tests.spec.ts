import { expect } from '@playwright/test';
import { test } from '@api-infra';
import { StatusCode } from 'api/enums/status-codes.enum';
import { TestTags } from 'api/enums/test-tags.enum';
import { AuthService } from 'api/infra/services/auth/auth.service';
import { logger } from 'api/logger/custom.logger';
import { User } from 'api/types/user/user.types';
import { MockData } from 'api/utils/mocks/mocks';

test.describe('Authentication api tests', { tag: TestTags.AUTH }, async () => {
  let adminUser: User;

  test.beforeEach(async ({ mockUser }) => {
    adminUser = {
      ...mockUser,
      roles: ['admin']
    }
  })
  test('should register user and login user', async ({ authenticationService, mockUser }) => {

    await test.step('should register and create user successfully - [POST] /auth/register', async () => {
      const response = await authenticationService.register(adminUser);
      const responseBody = await response.json();
      await expect(response).toBeOK();
      expect(response.status()).toBe(StatusCode.CREATED);
      expect(responseBody.access_token).toBeDefined();
      expect(responseBody.access_token).toBeTruthy();
      expect(responseBody.message).toBe('registered in successfully!');
      expect(responseBody.name).toBe(adminUser.name);
      expect(responseBody.lastName).toBe(adminUser.lastName);
    });

    await test.step('should login with created credentials successfully - [POST] /auth/login', async () => {
      const response = await authenticationService.login({
        username: adminUser.username,
        password: adminUser.password
      });
      const responseBody = await response.json();
      await expect(response).toBeOK();
      expect(responseBody.access_token).toBeDefined();
      expect(responseBody.access_token).toBeTruthy();
      expect(responseBody.message).toBe('logged in successfully!');
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