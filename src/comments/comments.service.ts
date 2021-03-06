import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TweetsService } from 'src/tweets/tweets.service';
import User from 'src/users/user.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private tweetsService: TweetsService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const tweet = await this.tweetsService.findOne(createCommentDto.tweetId);

    const newComment = await this.commentsRepository.create({
      ...createCommentDto,
      user: user,
      tweet: tweet,
    });

    await this.commentsRepository.save(newComment);

    return newComment;
  }

  async like(userId: number, commentId: number): Promise<Comment> {
    let comment = await this.commentsRepository.findOne({ id: commentId });
    const user = await this.userRepository.findOne(userId, {
      relations: ['commentLikes'],
    });

    const isNewLike =
      user.commentLikes.findIndex((_comment) => _comment.id === comment.id) < 0;

    if (isNewLike) {
      user.commentLikes.push(comment);
      comment.likeCount++;

      await this.userRepository.save(user);
      comment = await this.commentsRepository.save(comment);
    }

    return comment;
  }

  async unLike(userId: number, commentId: number): Promise<Comment> {
    let comment = await this.commentsRepository.findOne({ id: commentId });
    const user = await this.userRepository.findOne(userId, {
      relations: ['commentLikes'],
    });

    const deleteIndex = user.commentLikes.findIndex(
      (_comment) => _comment.id === comment.id,
    );

    if (deleteIndex >= 0) {
      user.commentLikes.splice(deleteIndex, 1);
      comment.likeCount--;

      await this.userRepository.save(user);
      comment = await this.commentsRepository.save(comment);
    }

    return comment;
  }
}
