import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Follows } from './entities/follows.entity';
import { Profile } from './profile.interface';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>
  ) { }

  async findProfile(currentUserId: number, followingUsername: string) {
    let user = await this.userRepository.findOne({ username: followingUsername });

    if (!user) return;

    let profile: Profile = {
      username: user.username,
      bio: user.bio,
    };

    const follows = await this.followsRepository.findOne({ followerId: currentUserId, followingId: user.id });

    // 1 call return all records where the user id exists as a follwerID or followingId
    const _follows = await this.followsRepository.find( {followerId: user.id });

    // const qb = await getRepository(ArticleEntity)
    // .createQueryBuilder('article')
    // .where('article.authorId IN (:ids)', { ids });
    // get follweres ids
    // get following ids 

    // query both and group by follower ids and following ids.. 

    // two separate queries 
    
    if (currentUserId) {
      profile.following = !!follows;
    }

    return profile;
  }

  async follow(currentUser, username: string) {
    const followingUser = await this.userRepository.findOne({username});

    if (currentUser.email === followingUser.email) {
      throw new HttpException('Current User and Following User cannot be equal. ', HttpStatus.BAD_REQUEST);
    }

    const _follows = await this.followsRepository.findOne({ followerId: currentUser.id, followingId: followingUser.id});

    if(!_follows) {
      const follows = new Follows();
      follows.followerId = currentUser.id,
      follows.followingId = followingUser.id;
      await this.followsRepository.save(follows);
    }

    let profile: Profile = {
      username: followingUser.username,
      bio: followingUser.bio,
      following: true
    }

    return profile;
  }
}

