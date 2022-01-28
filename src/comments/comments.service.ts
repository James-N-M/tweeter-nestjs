import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { TweetsService } from 'src/tweets/tweets.service';
import User from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private tweetsService: TweetsService
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {

    let tweet = await this.tweetsService.findOne(createCommentDto.tweetId);
    
    const newComment = await this.commentsRepository.create(
      {
        ...createCommentDto,
        userId: user.id,
        tweet: tweet
      });
    
    await this.commentsRepository.save(newComment);

    return newComment;
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
