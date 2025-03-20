import { Server as SocketIOServer } from 'socket.io';
import { Repository } from 'typeorm';
import { QueueEntry } from '../entities/QueueEntry';
import { Match } from '../entities/Match';
import { GameService } from './GameService';
import { SocketEvents } from '../../shared/types';

export class MatchmakingService {
  private io: SocketIOServer;
  private queueRepository: Repository<QueueEntry>;
  private matchRepository: Repository<Match>;
  private checkQueueIntervalId: NodeJS.Timeout | null = null;
  private checkQueueIntervalMs = 5000;

  constructor(
    io: SocketIOServer,
    queueRepository: Repository<QueueEntry>,
    matchRepository: Repository<Match>
  ) {
    this.io = io;
    this.queueRepository = queueRepository;
    this.matchRepository = matchRepository;
  }

  public start(): void {
    this.checkQueueIntervalId = setInterval(
      this.checkQueueForMatches.bind(this),
      this.checkQueueIntervalMs
    );
    console.log('Matchmaking service started');
  }

  public stop(): void {
    if (this.checkQueueIntervalId) {
      clearInterval(this.checkQueueIntervalId);
      this.checkQueueIntervalId = null;
    }
    console.log('Matchmaking service stopped');
  }

  private async checkQueueForMatches(): Promise<void> {
    try {
      const queueEntries = await this.queueRepository.find({
        order: {
          joinedAt: 'ASC'
        }
      });

      if (queueEntries.length >= 2) {
        const player1 = queueEntries[0];
        const player2 = queueEntries[1];
        
        await this.createMatch(player1, player2);
        
        await this.queueRepository.remove([player1, player2]);
      }
    } catch (error) {
      console.error('Error checking queue for matches:', error);
    }
  }

  private async createMatch(player1: QueueEntry, player2: QueueEntry): Promise<void> {
    try {
      const board = GameService.createEmptyBoard();
      
      const match = new Match();
      match.player1SocketId = player1.socketId;
      match.player1Nickname = player1.nickname;
      match.player2SocketId = player2.socketId;
      match.player2Nickname = player2.nickname;
      match.board = GameService.serializeBoard(board);
      match.status = 'in_progress';
      
      const savedMatch = await this.matchRepository.save(match);

      const firstPlayer = Math.random() < 0.5 ? 1 : 2;
      
      this.io.to(player1.socketId).emit(SocketEvents.MATCH_FOUND, {
        opponent: {
          id: player2.id,
          nickname: player2.nickname,
          socketId: player2.socketId
        },
        playerNumber: 1
      });
      
      this.io.to(player2.socketId).emit(SocketEvents.MATCH_FOUND, {
        opponent: {
          id: player1.id,
          nickname: player1.nickname,
          socketId: player1.socketId
        },
        playerNumber: 2
      });
      
      setTimeout(() => {
        this.io.to(player1.socketId).emit(SocketEvents.GAME_START, {
          gameId: savedMatch.id,
          board,
          currentTurn: firstPlayer 
        });
        
        this.io.to(player2.socketId).emit(SocketEvents.GAME_START, {
          gameId: savedMatch.id,
          board,
          currentTurn: firstPlayer
        });
      }, 1000); 
      
      console.log(`Match created between ${player1.nickname} and ${player2.nickname}`);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  }
}
