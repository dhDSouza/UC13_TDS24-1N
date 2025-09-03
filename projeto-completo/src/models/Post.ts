import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @ManyToOne(() => User, user => user.posts, { nullable: true, onDelete: 'SET NULL' })
    user: User | null;

    constructor(title: string, content: string, user: User | null) {
        this.title = title;
        this.content = content;
        this.user = user;
    }

}