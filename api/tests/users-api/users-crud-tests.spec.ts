import { expect } from '@playwright/test';
import { test } from '../../fixtures/merged-fixtures.fixture';
import { AuthService, TestTags, StatusCode, UsersService, MockData, User } from '@api-infra';
import { usersTestData } from './users-crud-test-data';

test.describe.serial('Users entity API CRUD tests - [GET, POST, PUT, DELETE] /users', { tag: TestTags.USERS }, async () => {
  let mockData: MockData;
  let userToCreate: User;

  test.beforeEach(async () => {
    mockData = new MockData();
    userToCreate = mockData.generateMockUser();
  })

  test('should get all users - [GET] /users', async ({ serviceFactory }) => {
    const response = await serviceFactory.userService.getAllUsers();
    const responseObj = await response.json();
    await expect(response).toBeOK();
    expect(response.status()).toBe(StatusCode.OK);
    expect(responseObj).toBeDefined();
    expect(responseObj).toStrictEqual(usersTestData);
  })

  test('should get user by id - [GET] /users/:id', async ({ serviceFactory }) => {
    await test.step('get user by id 1', async () => {
      const response = await serviceFactory.userService.getUser(1);
      const userData = await response.json();
      await expect(response).toBeOK();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData.name).toBe('John');
      expect(userData.lastName).toBe('Doe');
      expect(userData.roles).toStrictEqual(['admin']);
    });

    await test.step('get user by id 2', async () => {
      const response = await serviceFactory.userService.getUser(2);
      const userData = await response.json();
      await expect(response).toBeOK();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData.name).toBe('Jane');
      expect(userData.lastName).toBe('Smith');
      expect(userData.roles).toStrictEqual(['user']);
    });
  })

  test('should get user by query params - [GET] /users?query=param', async ({ serviceFactory }) => {
    await test.step('query by hobbie 1', async () => {
      const response = await serviceFactory.userService.getAllUsers({ hobbie: 'Tennis' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(2);
      expect(userData[0].name).toBe('Jane');
    });

    await test.step('query by hobbie 2', async () => {
      const response = await serviceFactory.userService.getAllUsers({ hobbie: 'Football' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(4);
      expect(userData[0].name).toBe('James');
    });

    await test.step('query by hobbie 3', async () => {
      const response = await serviceFactory.userService.getAllUsers({ hobbie: 'Basketball' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(1);
      expect(userData[0].name).toBe('John');
    });

    await test.step('query by hobbie 4', async () => {
      const response = await serviceFactory.userService.getAllUsers({ hobbie: 'Volleyball' });
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(3);
      expect(userData[0].name).toBe('Sara');
    });

    await test.step('query by female gender', async () => {
      const response = await serviceFactory.userService.getAllUsers({ gender: 'female' })
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
      const response = await serviceFactory.userService.getAllUsers({ gender: 'male' })
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
      const response = await serviceFactory.userService.getAllUsers({ name: 'John' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].id).toBe(1);
      expect(userData[0].hobbie).toBe('Basketball');
    });

    await test.step('query by username', async () => {
      const response = await serviceFactory.userService.getAllUsers({ username: 'janesmith' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].name).toBe('Jane');
      expect(userData[0].lastName).toBe('Smith');
    });

    await test.step('query by lastname', async () => {
      const response = await serviceFactory.userService.getAllUsers({ lastName: 'Jones' })
      const userData = await response.json();
      expect(response.status()).toBe(StatusCode.OK);
      expect(userData[0].name).toBe('James');
      expect(userData[0].id).toBe(4);
    });
  });


  test('create new user - [POST] /users', async ({ serviceFactory }) => {
    let adminUser = {
      ...mockData.generateMockUser('male'),
      roles: ['admin']
    }

    const response = await serviceFactory.userService.createUser(
      userToCreate,
      adminUser
    );

    const responseBody = await response.json();

    expect(response.status()).toBe(StatusCode.CREATED);
    expect(responseBody).toBeDefined();
    expect(responseBody.name).toBe(userToCreate.name);
    expect(responseBody.lastName).toBe(userToCreate.lastName);
  })
})