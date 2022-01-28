import { Tweet } from "src/tweets/entities/tweet.entity";
import User from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column('text')
    public text: string;

    @ManyToOne(() => Tweet, (tweet: Tweet) => tweet.comments)
    public tweet: Tweet;

    @Column()
    public userId: number;
}
