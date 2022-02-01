import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bookmark {
    @PrimaryGeneratedColumn()
    public id?: number;
    
    @Column()
    public userId: number;
    
    @Column()
    public tweetId: number;    
}
