import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import User from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, User]), UsersModule],
  controllers: [TweetsController],
  providers: [TweetsService],
  exports: [TweetsService],
})
export class TweetsModule {}
