import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Match } from './Match';

@Entity()
export class Turn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Match, match => match.turns, { nullable: false })
  @JoinColumn({ name: 'matchId' })
  match!: Match;

  @Column()
  matchId!: string;

  @Column()
  playerNumber!: 1 | 2;

  @Column()
  row!: number;

  @Column()
  col!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
