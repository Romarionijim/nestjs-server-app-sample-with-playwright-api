import { Body, Controller, Post, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/users.dto';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registeredUser: UserDto) {
    await this.authService.register(registeredUser);
  }

  @Post('login')
  async login(@Body() user: UserDto) {
    await this.authService.login(user.username, user.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getProfile(@Request() request) {
    return request.user;
  }
}
