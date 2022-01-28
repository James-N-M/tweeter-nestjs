import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { TweetsModule } from 'src/tweets/tweets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    TweetsModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService]
})
export class CommentsModule {}
