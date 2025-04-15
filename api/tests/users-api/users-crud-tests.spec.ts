import { test, expect } from '@playwright/test';
import { AuthService, TestTags, StatusCode, UsersService, MockData } from '@api-infra';
import { usersTestData } from './users-crud-test-data';
import { logger } from 'api/logger/custom.logger';
import { EndPoint } from '@api-infra';

test.describe('Users entity API CRUD tests - [GET, POST, PUT, DELETE] /users', { tag: TestTags.USERS }, async () => {
  let usersService: UsersService;
  let authService: AuthService;
  let mockData: MockData;
  
  const adminCredentials = {
    username: `admin${Date.now()}`,
    password: 'adminPassword123'
  };

  test.beforeEach(async ({ request }) => {
    usersService = new UsersService();
    authService = new AuthService();
    mockData = new MockData();
    
    await usersService.authenticate(adminCredentials.username, adminCredentials.password);
  });

  test('should get all users - [GET] /users', async () => {
    const response = await usersService.getAllUsers();
    const responseObj = await response.json();
    await expect(response).toBeOK();
    expect(response.status()).toBe(StatusCode.OK);
    expect(responseObj).toBeDefined();
    expect(responseObj).toStrictEqual(usersTestData);
  });

  test('should get user by id - [GET] /users/:id', async () => {
    await test.step('get user by id 1', async () => {
      const response = await usersService.getUser(1);
      const userData = await response.json();
      await expect(response).toBeOK();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData.name).toBe('John');
      expect(userData.lastName).toBe('Doe');
      expect(userData.roles).toStrictEqual(['admin']);
    });

    await test.step('get user by id 2', async () => {
      const response = await usersService.getUser(2);
      const userData = await response.json();
      await expect(response).toBeOK();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData.name).toBe('Jane');
      expect(userData.lastName).toBe('Smith');
      expect(userData.roles).toStrictEqual(['user']);
    });
  });

  test('should get user by query params - [GET] /users?query=param', async () => {
    await test.step('query by hobbie 1', async () => {
      const response = await usersService.getAllUsers({ hobbie: 'Tennis' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(2);
      expect(userData[0].name).toBe('Jane');
    });

    await test.step('query by hobbie 2', async () => {
      const response = await usersService.getAllUsers({ hobbie: 'Football' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(4);
      expect(userData[0].name).toBe('James');
    });

    await test.step('query by hobbie 3', async () => {
      const response = await usersService.getAllUsers({ hobbie: 'Basketball' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(1);
      expect(userData[0].name).toBe('John');
    });

    await test.step('query by hobbie 4', async () => {
      const response = await usersService.getAllUsers({ hobbie: 'Volleyball' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(3);
      expect(userData[0].name).toBe('Sara');
    });

    await test.step('query by female gender', async () => {
      const response = await usersService.getAllUsers({ gender: 'female' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData).toStrictEqual([
        {
          id: 2,
          name: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          password: 'secret',
          hobbie: 'Tennis',
          gender: 'female',
          roles: ['user']
        },
        {
          id: 3,
          name: 'Sara',
          lastName: 'James',
          username: 'sarajames',
          password: 'secret',
          hobbie: 'Volleyball',
          gender: 'female',
          roles: ['user']
        }
      ])
    });

    await test.step('query by male gender', async () => {
      const response = await usersService.getAllUsers({ gender: 'male' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData).toStrictEqual([
        {
          id: 1,
          name: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          password: 'secret',
          hobbie: 'Basketball',
          gender: 'male',
          roles: ['admin']
        },
        {
          id: 4,
          name: 'James',
          lastName: 'Jones',
          username: 'jamesjones',
          password: 'secret',
          hobbie: 'Football',
          gender: 'male',
          roles: ['user']
        }
      ])
    });

    await test.step('query by name', async () => {
      const response = await usersService.getAllUsers({ name: 'John' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(1);
      expect(userData[0].hobbie).toBe('Basketball');
    });

    await test.step('query by username', async () => {
      const response = await usersService.getAllUsers({ username: 'janesmith' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].name).toBe('Jane');
      expect(userData[0].lastName).toBe('Smith');
    });

    await test.step('query by lastname', async () => {
      const response = await usersService.getAllUsers({ lastName: 'Jones' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].name).toBe('James');
      expect(userData[0].id).toBe(4);
    });
  });

  test('create new user - [POST] /users @post', async () => {
    const userToCreate = mockData.generateMockUser();
    const response = await usersService.createUser(userToCreate);
    
    const responseBody = await response.json();
    logger.log(responseBody);

    expect(response.status()).toBe(StatusCode.OK);
  });

  test('update user - [PUT] /users/:id @put', async () => {
    const userToCreate = mockData.generateMockUser();
    const createResponse = await usersService.createUser(userToCreate);
    const createdUser = await createResponse.json();
    
    const updatedFields = { 
      name: 'Updated Name',
      lastName: 'Updated LastName',
      username: 'updated_username',
      password: 'updated_password',
      hobbie: 'Updated Hobby',
      gender: 'other',
      roles: ['user']
    };
    
    const response = await usersService.updateUser(createdUser.id, updatedFields);
    expect(response.status()).toBe(StatusCode.OK);
  });

  test('delete user - [DELETE] /users/:id @delete', async () => {
    const userToCreate = mockData.generateMockUser();
    const createResponse = await usersService.createUser(userToCreate);
    const createdUser = await createResponse.json();
    
    const response = await usersService.deleteUser(createdUser.id);
    expect(response.status()).toBe(StatusCode.OK);
  });
});