import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { Profile } from './profile.interface';

import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, description: 'Return a users profile.' })
  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Req() req: RequestWithUser,
    @Param('username') username: string,
  ) {
    return await this.profilesService.findProfile(req.user.id, username);
  }

  @Post(':username/follow')
  @UseGuards(JwtAuthGuard)
  async follow(
    @Req() req: RequestWithUser,
    @Param('username') username: string,
  ): Promise<Profile> {
    return await this.profilesService.follow(req.user, username);
  }
}
