import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { usersInMemoryData } from './db/in-memory.db';

@Injectable()
export class UsersService {

  async findAll(query: Partial<UserDto> = {}) {
    const secureUsers = usersInMemoryData.map(user => ({
      ...user,
      password: 'secret'
    }))
    for (let [key, value] of Object.entries(query)) {
      return secureUsers.filter(param => param[key] === value)
    }
    return secureUsers;
  }

  async findOne(id: number) {
    const user = usersInMemoryData.find((user) => user.id === id);
    return user ? { ...user, password: 'secret' } : []
  }

  async findOneByUsername(username: string) {
    return usersInMemoryData.find((user) => user.username === username);
  }

  async createUser(user: UserDto) {
    const newUser = {
      id: usersInMemoryData.length + 1,
      ...user
    }
    usersInMemoryData.push(newUser)
    return newUser;
  }

  async updateUser(id: number, updatedUser: Partial<Omit<UserDto, 'id'>>) {
    const userIndex = usersInMemoryData.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`user with the id: ${id} does not exist!`);
    }
    usersInMemoryData[userIndex] = { ...usersInMemoryData[userIndex], ...updatedUser };
    return usersInMemoryData[userIndex];
  }

  async deleteUser(id: number) {
    const index = usersInMemoryData.findIndex((user) => user.id === id)
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    usersInMemoryData.splice(index, 1)
    return {
      message: 'User deleted successfully',
      users: usersInMemoryData,
    };
  }
}
