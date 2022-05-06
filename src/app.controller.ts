import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './auth/dto/login-user.dto';
import RegisterDto from './auth/dto/register.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import RequestWithUser from './auth/requestWithUser.interface';
import User from './users/user.entity';

@ApiTags('application')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/register')
  @ApiOperation({ summary: 'Register a user' })
  async register(@Body() registrationDataDto: RegisterDto): Promise<User> {
    return this.authService.register(registrationDataDto);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Create an access token' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AccessToken> {
    const user: User = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get the authenticated user' })
  getProfile(@Request() req: RequestWithUser): User {
    return req.user;
  }

  @Get()
  @ApiOperation({ summary: 'Application Status' })
  getHello() {
    return { status: 'Tweeter NestJS Api running' };
  }
}
