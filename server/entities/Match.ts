import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Turn } from './Turn';
import { GameResult, GameStatus } from '../../shared/types';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  player1SocketId!: string;

  @Column()
  player1Nickname!: string;

  @Column()
  player2SocketId!: string;

  @Column()
  player2Nickname!: string;

  @Column('simple-json')
  board!: (string | null)[][];

  @Column({
    type: 'simple-enum',
    enum: ['waiting', 'in_progress', 'finished'],
    default: 'waiting'
  })
  status!: GameStatus;

  @Column({
    type: 'simple-enum',
    enum: ['player1_win', 'player2_win', 'draw', null],
    nullable: true,
    default: null
  })
  result!: GameResult;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  finishedAt?: Date;

  @OneToMany(() => Turn, turn => turn.match)
  turns!: Turn[];
}
