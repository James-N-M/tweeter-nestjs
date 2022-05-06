import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';

import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

import path = require('path');
export const storage = {
  storage: diskStorage({
    destination: './uploads/tweet-comment-images',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create comment' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  create(
    @UploadedFile() file,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    if (file) {
      createCommentDto.image = file.filename;
    }
    return this.commentsService.create(createCommentDto, req.user);
  }

  @ApiOperation({ summary: 'Like comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully liked.',
  })
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    return await this.commentsService.like(req.user.id, parseInt(id));
  }
}
