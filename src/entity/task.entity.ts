import { Entity } from "typeorm";
import { PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn } from "typeorm";

@Entity()
class Task{
    @PrimaryGeneratedColumn()
    id: string;
    @Column()
    title: string;
    @Column()
    description: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
 }

export default Task

  