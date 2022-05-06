import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from 'src/users/user.entity';

import { Follows } from './entities/follows.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follows])],
  providers: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
