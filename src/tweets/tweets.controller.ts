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

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
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
  findAll() {
    return this.tweetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tweetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tweetsService.remove(+id);
  }
}
