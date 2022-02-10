import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/users/user.entity';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService
      ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);
    const isPasswordMatch = await bcrypt.compare(
      pass,
      user.password
    );
    if (user && isPasswordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload: TokenPayload = { userId: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      // TODO add error catch for unique email 
      // if (error?.code === PostgresErrorCode.UniqueViolation) {
      //   throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      // }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}