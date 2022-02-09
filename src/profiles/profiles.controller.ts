import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
 constructor(private readonly profilesService: ProfilesService) {}

 @ApiOperation({ summary: 'Get profile' })
 @ApiResponse({ status: 200, description: 'Return a users profile.' })
 @Get(':username')
 async getProfile(@Req() req: RequestWithUser, @Param('username') username: string) {

    return await this.profilesService.findProfile(null, username);
  }
}
