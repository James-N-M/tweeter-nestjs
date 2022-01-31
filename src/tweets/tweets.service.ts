import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from './entities/tweet.entity';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetsRepository: Repository<Tweet>
  ) {}

  async create(createTweetDto: CreateTweetDto, user: User) {
    const newTweet = await this.tweetsRepository.create(
      {
        ...createTweetDto,
        user: user
      });
    await this.tweetsRepository.save(newTweet);

    delete newTweet.user;
    
    return newTweet;
  }

  async findAll() {
    return await this.tweetsRepository.find({relations: ['comments']});
  }

  async findOne(id: number) {
    return await this.tweetsRepository.findOne({ id });
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
