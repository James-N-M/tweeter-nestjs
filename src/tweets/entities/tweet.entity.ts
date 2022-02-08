import User from 'src/users/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tweet {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column('text')
    public text: string;

    @Column('tinyint', { default: 1 })
    public public: boolean;    

    @Column({nullable: true})
    public image: string;

    @ManyToOne(() => User, (user: User) => user.tweets)
    public user: User;

    @OneToMany(() => Comment, (comment: Comment) => comment.tweet)
    public comments: Comment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({default: 0})
    likeCount: number;
}
