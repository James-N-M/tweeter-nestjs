import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { TweetsModule } from 'src/tweets/tweets.module';
import { UsersModule } from 'src/users/users.module';
import User from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User]),
    TweetsModule,
    UsersModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService]
})
export class CommentsModule {}
