import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './auth/dto/login-user.dto';
import RegisterDto from './auth/dto/register.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import RequestWithUser from './auth/requestWithUser.interface';

@ApiTags('application')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('auth/register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @Post('auth/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AccessToken> {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Get()
  getHello() {
    return { status: 'Tweeter NestJS Api running' };
  }
}
