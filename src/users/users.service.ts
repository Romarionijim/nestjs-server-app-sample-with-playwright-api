import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  usersInMemoryData = [
    {
      id: 1,
      name: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password1234',
      hobbie: 'Basketball',
      gender: 'male',
      roles: ['admin']
    },
    {
      id: 2,
      name: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      password: 'password1234',
      hobbie: 'Tennis',
      gender: 'female',
      roles: ['user']
    },
    {
      id: 3,
      name: 'Sara',
      lastName: 'James',
      username: 'sarajames',
      password: 'password1234',
      hobbie: 'VolleyBall',
      gender: 'female',
      roles: ['user']
    },
    {
      id: 4,
      name: 'James',
      lastName: 'Jones',
      username: 'jamesjones',
      password: 'password1234',
      hobbie: 'Football',
      gender: 'male',
      roles: ['user']
    },
  ]

  async findAll(query: Partial<UserDto> = {}) {
    const secureUsers = this.usersInMemoryData.map(user => ({
      ...user,
      password: 'secret'
    }))
    for (let [key, value] of Object.entries(query)) {
      return secureUsers.filter(param => param[key] === value)
    }
    return secureUsers;
  }

  async findOne(id: number) {
    const user = this.usersInMemoryData.find((user) => user.id === id);
    return user ? { ...user, password: 'secret' } : []
  }

  async findOneByUsername(username: string) {
    return this.usersInMemoryData.find((user) => user.username === username);
  }

  async createUser(user: UserDto) {
    const newUser = {
      id: this.usersInMemoryData.length + 1,
      ...user
    }
    this.usersInMemoryData.push(newUser)
    return newUser;
  }

  async updateUser(id: number, updatedUser: Partial<Omit<UserDto, 'id'>>) {
    const userIndex = this.usersInMemoryData.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`user with the id: ${id} does not exist!`);
    }
    this.usersInMemoryData[userIndex] = { ...this.usersInMemoryData[userIndex], ...updatedUser };
    return this.usersInMemoryData[userIndex];
  }

  async deleteUser(id: number) {
    const index = this.usersInMemoryData.findIndex((user) => user.id === id)
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.usersInMemoryData.splice(index, 1)
    return {
      message: 'User deleted successfully',
      users: this.usersInMemoryData,
    };
  }
}
