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
    try {
      const currentUser = await this.usersService.findOneByUsername(userData.username);
      if (currentUser) {
        throw new HttpException(`user with the username ${userData.username} already exists`, HttpStatus.BAD_REQUEST);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const registeredUser = {
        ...userData,
        password: hashedPassword,
        roles: userData.roles || ['user']
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
        access_token: await this.jwtService.signAsync(payloadToSign),
        message: 'registered successfully!'
      };
    } catch (error) {
      throw error;
    }
  }

  async login(username: string, password: string) {
    try {
      const currentUser = await this.usersService.findOneByUsername(username);
      if (currentUser) {
        const isPasswordValid = await bcrypt.compare(password, currentUser.password)

        if (isPasswordValid) {
          const { password, ...userWithoutExposedPassword } = currentUser;

          const payLoadToSign = {
            sub: currentUser.id,
            username: currentUser.username,
            roles: currentUser.roles
          }

          return {
            ...userWithoutExposedPassword,
            access_token: await this.jwtService.signAsync(payLoadToSign),
            message: 'logged in successfully!'
          };
        }
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}
