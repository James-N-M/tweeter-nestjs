import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Follows } from './entities/follows.entity';
import { Profile } from './profile.interface';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>,
  ) {}

  async findProfile(currentUserId: number, followingUsername: string) {
    const user = await this.userRepository.findOne({
      username: followingUsername,
    });

    if (!user) return;

    const profile: Profile = {
      username: user.username,
      bio: user.bio,
    };

    // Is the current user following user
    const follows = await this.followsRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });

    if (currentUserId) {
      profile.isFollowing = !!follows;
    }

    const qb = await getRepository(Follows)
      .createQueryBuilder('follows')
      .where('follows.followerId = :followerId', { followerId: user.id })
      .orWhere('follows.followingId = :followingId', {
        followingId: user.id,
      });

    const followersAndFollowing = await qb.getMany();

    const followingIds = followersAndFollowing
      .map((record) => {
        if(record.followerId === user.id) {
          return record.followerId
        }
      });
      
    const followerIds = followersAndFollowing
      .map((record) => {
        if(record.followingId === user.id) {
          return record.followingId;
        }
      }); 

    const followers = await this.userRepository.findByIds(followerIds);

    const following = await this.userRepository.findByIds(followingIds);

    return {
      profile,
      followers,
      following
    };
  }

  async follow(currentUser, username: string) {
    const followingUser = await this.userRepository.findOne({ username });

    if (currentUser.email === followingUser.email) {
      throw new HttpException(
        'Current User and Following User cannot be equal. ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _follows = await this.followsRepository.findOne({
      followerId: currentUser.id,
      followingId: followingUser.id,
    });

    if (!_follows) {
      const follows = new Follows();
      (follows.followerId = currentUser.id),
        (follows.followingId = followingUser.id);
      await this.followsRepository.save(follows);
    }

    const profile: Profile = {
      username: followingUser.username,
      bio: followingUser.bio,
      isFollowing: true,
    };

    return profile;
  }
}
