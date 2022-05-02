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
    private readonly tweetsRepository: Repository<Tweet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTweetDto: CreateTweetDto, user: User) {
    const newTweet = await this.tweetsRepository.create({
      ...createTweetDto,
      user: user,
    });
    await this.tweetsRepository.save(newTweet);

    delete newTweet.user;

    return newTweet;
  }

  async retweet(tweetId: number, user: User) {
    const tweet = await this.tweetsRepository.findOne({ id: tweetId });

    const newTweet = await this.tweetsRepository.create({
      ...tweet,
      originalTweetId: tweetId,
      user: user,
    });

    await this.tweetsRepository.save(newTweet);

    delete newTweet.user;

    return newTweet;
  }

  async findAll() {
    return await this.tweetsRepository.find({ relations: ['comments'] });
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

  async like(userId: number, tweetId: number) {
    let tweet = await this.tweetsRepository.findOne({ id: tweetId });
    const user = await this.userRepository.findOne(userId, {
      relations: ['tweetLikes'],
    });

    const isNewLike =
      user.tweetLikes.findIndex((_tweet) => _tweet.id === tweet.id) < 0;
    if (isNewLike) {
      user.tweetLikes.push(tweet);
      tweet.likeCount++;

      await this.userRepository.save(user);
      tweet = await this.tweetsRepository.save(tweet);
    }

    return { tweet };
  }

  async unLike(userId: number, tweetId: number) {
    let tweet = await this.tweetsRepository.findOne({ id: tweetId });
    const user = await this.userRepository.findOne(userId, {
      relations: ['tweetLikes'],
    });

    const deleteIndex = user.tweetLikes.findIndex(
      (_tweet) => _tweet.id === tweet.id,
    );

    if (deleteIndex >= 0) {
      user.tweetLikes.splice(deleteIndex, 1);
      tweet.likeCount--;

      await this.userRepository.save(user);
      tweet = await this.tweetsRepository.save(tweet);
    }

    return { tweet };
  }

  async bookmark(userId: number, tweetId: number) {
    const tweet = await this.tweetsRepository.findOne({ id: tweetId });
    const user = await this.userRepository.findOne(userId, {
      relations: ['bookmarks'],
    });

    const isNewBookmark =
      user.bookmarks.findIndex((_tweet) => _tweet.id === tweet.id) < 0;
    if (isNewBookmark) {
      user.bookmarks.push(tweet);
      await this.userRepository.save(user);
    }

    return { tweet };
  }

  async findAllBookmarks(userId: number) {
    const bookmarks = await (
      await this.userRepository.findOne(userId, { relations: ['bookmarks'] })
    ).bookmarks;

    return bookmarks;
  }
}
