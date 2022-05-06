import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';

import { CreateTweetDto } from './dto/create-tweet.dto';
import { TweetsService } from './tweets.service';

import path = require('path');
import { Tweet } from './entities/tweet.entity';
export const storage = {
  storage: diskStorage({
    destination: './uploads/tweetimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@ApiTags('tweets')
@ApiBearerAuth()
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create tweet' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  create(
    @UploadedFile() file,
    @Body() tweet: CreateTweetDto,
    @Req() req: RequestWithUser,
  ): Promise<Tweet> {
    tweet.public = Boolean(tweet.public);

    if (file) {
      tweet.image = file.filename;
    }
    return this.tweetsService.create(tweet, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tweets' })
  @ApiResponse({ status: 200, description: 'Return all tweets.' })
  findAll(): Promise<Tweet[]> {
    return this.tweetsService.findAll();
  }

  @ApiOperation({ summary: 'Bookmark tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully bookmarked.',
  })
  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  async bookmark(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Tweet> {
    return await this.tweetsService.bookmark(req.user.id, parseInt(id));
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'Get all current user bookmarks' })
  @ApiResponse({ status: 200, description: 'Return all bookmarked tweets.' })
  @UseGuards(JwtAuthGuard)
  async bookmarks(@Req() req: RequestWithUser): Promise<Tweet[]> {
    return await this.tweetsService.findAllBookmarks(req.user.id);
  }

  @ApiOperation({ summary: 'retweet tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully retweeted.',
  })
  @Post(':id/retweet')
  @UseGuards(JwtAuthGuard)
  async retweet(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Tweet> {
    return await this.tweetsService.retweet(parseInt(id), req.user);
  }

  @ApiOperation({ summary: 'Like tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully liked.',
  })
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Tweet> {
    return await this.tweetsService.like(req.user.id, parseInt(id));
  }

  @ApiOperation({ summary: 'Unlike tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully unliked.',
  })
  @Delete(':id/unlike')
  @UseGuards(JwtAuthGuard)
  async unLike(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Tweet> {
    return await this.tweetsService.unLike(req.user.id, parseInt(id));
  }
}
