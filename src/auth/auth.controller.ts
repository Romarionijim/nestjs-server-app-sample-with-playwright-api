import { Body, Controller, Post, UseGuards, Get, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/users.dto';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(201)
  async register(@Body() registeredUser: UserDto) {
    return await this.authService.register(registeredUser);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() user: UserDto) {
    return await this.authService.login(user.username, user.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getProfile(@Request() request: ExpressRequest) {
    if ('user' in request) {
      return request.user;
    }
  }
}
