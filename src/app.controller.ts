import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // DONT FORGET ABOUT CONTROLLER ROUTE NAMES /controllername/thing
  @Post('auth/login')
  login(): any {
    return {
      'access_token': "thisisarandomaccesstokenplaceholder1234556789"
    };
  }

  @Get('/products')
  getProducts() {
    return this.appService.getProducts();
  }
}
