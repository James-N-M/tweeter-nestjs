import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tweet } from 'src/tweets/entities/tweet.entity'; 

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
 
  @Column()
  public password: string;

  @OneToMany(() => Tweet, (tweet: Tweet) => tweet.user)
  public tweets: Tweet[];
}
 
export default User;