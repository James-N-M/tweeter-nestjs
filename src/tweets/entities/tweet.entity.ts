import User from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tweet {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column('text')
    public text: string;

    @ManyToOne(() => User, (user: User) => user.tweets)
    public user: User;
}
