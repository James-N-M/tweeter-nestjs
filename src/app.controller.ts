import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import RegisterDto from './auth/dto/register.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import RequestWithUser from './auth/requestWithUser.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Post('auth/register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  // DONT FORGET ABOUT CONTROLLER ROUTE NAMES /controllername/thing
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // JWT guarded route
  // pass value returned as authorization bearer token 
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Get('/products')
  getProducts() {
    return this.appService.getProducts();
  }

  @Get()
  getHello() {
    return {status: "Tweeter NestJS Api running"}
  }
}
