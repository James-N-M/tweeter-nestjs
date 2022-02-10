import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Tweet } from 'src/tweets/entities/tweet.entity'; 
import { Comment } from 'src/comments/entities/comment.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;
 
  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;
 
  @Column()
  public username: string;

  @Column({nullable: true})
  public bio: string;
 
  @Column()
  public password: string;

  @OneToMany(() => Tweet, (tweet: Tweet) => tweet.user)
  public tweets: Tweet[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  public comments: Comment[];

  @ManyToMany(type => Tweet)
  @JoinTable()
  bookmarks: Tweet[];

  @ManyToMany(type => Tweet)
  @JoinTable()
  tweetLikes: Tweet[];

  @ManyToMany(type => Comment)
  @JoinTable()
  commentLikes: Comment[];
}
 
export default User;