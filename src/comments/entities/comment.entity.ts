import { Tweet } from 'src/tweets/entities/tweet.entity';
import User from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public text: string;

  @ManyToOne(() => Tweet, (tweet: Tweet) => tweet.comments)
  public tweet: Tweet;

  @Column({ nullable: true })
  public image: string;

  @ManyToOne(() => User, (user: User) => user.comments)
  public user: User;

  @Column({default: 0})
  likeCount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
