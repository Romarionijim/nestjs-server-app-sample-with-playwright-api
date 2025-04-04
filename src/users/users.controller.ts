import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(@Query() query: Partial<UserDto> = {}) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  async createUser(@Body() user: UserDto) {
    return await this.usersService.createUser(user);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUserDto: Partial<UserDto>
  ) {
    return await this.usersService.updateUser(id, updatedUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }
}
