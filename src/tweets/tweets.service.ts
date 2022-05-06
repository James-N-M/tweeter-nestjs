import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './entities/tweet.entity';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetsRepository: Repository<Tweet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTweetDto: CreateTweetDto, user: User): Promise<Tweet> {
    const newTweet: Tweet = await this.tweetsRepository.create({
      ...createTweetDto,
      user: user,
    });
    await this.tweetsRepository.save(newTweet);

    delete newTweet.user;

    return newTweet;
  }

  async retweet(tweetId: number, user: User): Promise<Tweet> {
    const tweet: Tweet = await this.tweetsRepository.findOne({ id: tweetId });

    const newTweet: Tweet = await this.tweetsRepository.create({
      ...tweet,
      originalTweetId: tweetId,
      user: user,
    });

    await this.tweetsRepository.save(newTweet);

    delete newTweet.user;

    return newTweet;
  }

  async findAll(): Promise<Tweet[]> {
    return await this.tweetsRepository.find({ relations: ['comments'] });
  }

  async findOne(id: number): Promise<Tweet> {
    return await this.tweetsRepository.findOne({ id });
  }

  async like(userId: number, tweetId: number): Promise<Tweet> {
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

    return tweet;
  }

  async unLike(userId: number, tweetId: number): Promise<Tweet> {
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

    return tweet;
  }

  async bookmark(userId: number, tweetId: number): Promise<Tweet> {
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

    return tweet;
  }

  async findAllBookmarks(userId: number): Promise<Tweet[]> {
    const bookmarks = await (
      await this.userRepository.findOne(userId, { relations: ['bookmarks'] })
    ).bookmarks;

    return bookmarks;
  }
}
