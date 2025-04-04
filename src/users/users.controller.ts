import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiQuery({ required: false })
  async findAll(@Query() query: Partial<UserDto> = {}) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(201)
  async createUser(@Body() user: UserDto) {
    return await this.usersService.createUser(user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUserDto: Partial<UserDto>
  ) {
    return await this.usersService.updateUser(id, updatedUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(204)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }
}
