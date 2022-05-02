import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import path = require('path');
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
@ApiHeader({
  name: 'My Header',
  description: 'A Custom Header'
})
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create tweet' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  create(
    @UploadedFile() file,
    @Body('tweet') tweet: CreateTweetDto,
    @Req() req: RequestWithUser,
  ) {
    tweet.public = Boolean(tweet.public);

    if (file) {
      tweet.image = file.filename;
    }
    return this.tweetsService.create(tweet, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tweets' })
  @ApiResponse({ status: 200, description: 'Return all tweets.' })
  findAll() {
    return this.tweetsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tweetsService.remove(+id);
  }

  @ApiOperation({ summary: 'Bookmark tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully bookmarked.',
  })
  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  async bookmark(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.tweetsService.bookmark(req.user.id, parseInt(id));
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'Get all current user bookmarks' })
  @ApiResponse({ status: 200, description: 'Return all bookmarked tweets.' })
  @UseGuards(JwtAuthGuard)
  async bookmarks(@Req() req: RequestWithUser) {
    return await this.tweetsService.findAllBookmarks(req.user.id);
  }

  @ApiOperation({ summary: 'retweet tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully retweeted.',
  })
  @Post(':id/retweet')
  @UseGuards(JwtAuthGuard)
  async retweet(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.tweetsService.retweet(parseInt(id), req.user);
  }

  @ApiOperation({ summary: 'Like tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully liked.',
  })
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.tweetsService.like(req.user.id, parseInt(id));
  }

  @ApiOperation({ summary: 'Unlike tweet' })
  @ApiResponse({
    status: 201,
    description: 'The tweet has been successfully unliked.',
  })
  @Delete(':id/unlike')
  @UseGuards(JwtAuthGuard)
  async unLike(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.tweetsService.unLike(req.user.id, parseInt(id));
  }
}
