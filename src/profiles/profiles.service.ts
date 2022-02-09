import { Injectable } from '@nestjs/common';
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
    ) {}

    async findProfile(currentUserId: number, followingUsername: string) {
        let user = await this.userRepository.findOne( {username: followingUsername});
    
        if(!user) return;
    
        let profile: Profile = {
          username: user.username,
          bio: user.bio,
        //   image: _profile.image
        };
    
        const follows = await this.followsRepository.findOne( {followerId: currentUserId, followingId: user.id});
    
        if (currentUserId) {
          profile.following = !!follows;
        }
    
        return profile;
      }
}

