import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('follows')
export class Follows {
  @PrimaryGeneratedColumn()
  id: number;

  // the person creating the follow
  @Column()
  followerId: number;

  // the folowee is the person who is gaining the follower
  @Column()
  followingId: number; // followee_id
}
