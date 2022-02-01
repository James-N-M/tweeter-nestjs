import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet]),
    BookmarksModule],
  controllers: [TweetsController],
  providers: [TweetsService],
  exports: [TweetsService]
})
export class TweetsModule { }
