import { test, expect } from '@playwright/test';
import { AuthService, TestTags, StatusCode, UsersService } from '@api-infra';

test.describe('Users entity API CRUD tests - [GET, POST, PUT, DELETE] /users', async () => {
  let usersService: UsersService;
  let authService: AuthService;
  const inMemoryData = [
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
    },
  ]

  test.beforeEach(async ({ request }) => {
    usersService = new UsersService(request);
    authService = new AuthService(request);
  })

  test('should get all users - [GET] /users', { tag: TestTags.USERS }, async () => {
    const response = await usersService.getAllUsers();
    const responseObj = await response.json();
    await expect(response).toBeOK();
    expect(response.status()).toBe(StatusCode.OK);
    expect(responseObj).toBeDefined();
    expect(responseObj).toStrictEqual(inMemoryData);
  })

  // test('should get user with relevant query param - [GET] /users?query=value', async () => {

  // })

  // test('should get specific user with id', async () => {

  // })
})