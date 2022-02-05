import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import path = require('path');
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export const storage = {
  storage: diskStorage({
      destination: './uploads/tweetimages',
      filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`)
      }
  })
}

@ApiTags('tweets')
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create tweet' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  create(@UploadedFile() file, @Body() tweet: CreateTweetDto, @Req() req: RequestWithUser) {

    tweet.public = Boolean(tweet.public);
    
    if(file) {
      tweet.image = file.filename;
      return this.tweetsService.create(tweet, req.user);
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
  async favorite(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.tweetsService.bookmark(req.user.id, parseInt(id));
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'Get all current user bookmarks' })
  @ApiResponse({ status: 200, description: 'Return all bookmarked tweets.' })
  @UseGuards(JwtAuthGuard)
  async bookmarks(@Req() req: RequestWithUser) {
    return await this.tweetsService.findAllBookmarks(req.user.id); 
  }
}
