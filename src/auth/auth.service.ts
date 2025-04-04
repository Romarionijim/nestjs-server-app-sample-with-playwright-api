import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async register(userData: UserDto) {
    const currentUser = await this.usersService.findOneByUsername(userData.username);
    if (currentUser) {
      throw new HttpException(`user with the username ${userData.username} already exists`, HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const registeredUser = {
      ...userData,
      password: hashedPassword
    }

    console.log('about to add: ', registeredUser);
    const result = await this.usersService.createUser(registeredUser);
    console.log('user added, result: ', result);

    const payloadToSign = {
      sub: result.id,
      username: result.username,
      roles: result.roles
    }

    return {
      ...result,
      access_token: await this.jwtService.signAsync(payloadToSign)
    };
  }

  async login(user: UserDto) {
    const currentUser = await this.usersService.findOneByUsername(user.username);
    if (!currentUser) {
      throw new NotFoundException();
    }
    const isPasswordValid = await bcrypt.compare(user.password, currentUser.password)
    if (!isPasswordValid) {
      throw new ForbiddenException();
    }

    const { password, ...userWithoutExposedPassword } = currentUser;

    const payLoadToSign = {
      sub: currentUser.id,
      username: currentUser.username,
      roles: currentUser.roles
    }

    return {
      ...userWithoutExposedPassword,
      access_token: await this.jwtService.signAsync(payLoadToSign)
    };
  }
}
