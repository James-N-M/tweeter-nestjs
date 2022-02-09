import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { Follows } from './entities/follows.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Follows])
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController]
})
export class ProfilesModule {}
