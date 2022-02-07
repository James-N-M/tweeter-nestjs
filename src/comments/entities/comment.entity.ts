import { Tweet } from 'src/tweets/entities/tweet.entity';
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
  public id?: number;

  @Column('text')
  public text: string;

  @ManyToOne(() => Tweet, (tweet: Tweet) => tweet.comments)
  public tweet: Tweet;

  @Column({ nullable: true })
  public image: string;

  @Column()
  public userId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
