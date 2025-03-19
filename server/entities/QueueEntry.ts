import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class QueueEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nickname!: string;

  @Column()
  socketId!: string;

  @CreateDateColumn()
  joinedAt!: Date;
}
