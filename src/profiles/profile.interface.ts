import User from 'src/users/user.entity';

export interface Profile {
  username: string;
  bio: string;
  isFollowing?: boolean;
}
