import { Server as SocketIOServer, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { QueueEntry } from '../entities/QueueEntry';
import { Match } from '../entities/Match';
import { Turn } from '../entities/Turn';
import { 
  GameMove, 
  SocketEvents, 
  JoinQueuePayload, 
  MakeMovePayload
} from '../../shared/types';
import { GameService } from '../services/GameService';

export class SocketHandler {
  private io: SocketIOServer;
  private queueRepository: Repository<QueueEntry>;
  private matchRepository: Repository<Match>;
  private turnRepository: Repository<Turn>;

  constructor(
    io: SocketIOServer,
    queueRepository: Repository<QueueEntry>,
    matchRepository: Repository<Match>,
    turnRepository: Repository<Turn>
  ) {
    this.io = io;
    this.queueRepository = queueRepository;
    this.matchRepository = matchRepository;
    this.turnRepository = turnRepository;
    this.setupSocketEvents();
  }

  private setupSocketEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on(SocketEvents.JOIN_QUEUE, (payload: JoinQueuePayload) => 
        this.handleJoinQueue(socket, payload));

      socket.on(SocketEvents.MAKE_MOVE, (payload: MakeMovePayload) => 
        this.handleMakeMove(socket, payload));

      socket.on(SocketEvents.LEAVE_GAME, () => 
        this.handleLeaveGame(socket));

      socket.on('disconnect', () => 
        this.handleDisconnect(socket));
    });
  }

  private async handleJoinQueue(socket: Socket, payload: JoinQueuePayload): Promise<void> {
    try {
      const queueEntry = new QueueEntry();
      queueEntry.nickname = payload.nickname;
      queueEntry.socketId = socket.id;

      await this.queueRepository.save(queueEntry);
      
      console.log(`Player ${payload.nickname} joined queue`);
    } catch (error) {
      console.error('Error joining queue:', error);
      socket.emit(SocketEvents.ERROR, {
        message: 'Failed to join queue',
        code: 'JOIN_QUEUE_ERROR'
      });
    }
  }

  private async handleMakeMove(socket: Socket, payload: MakeMovePayload): Promise<void> {
    try {
      const match = await this.matchRepository.findOne({
        where: { id: payload.gameId },
        relations: ['turns']
      });

      if (!match) {
        throw new Error('Match not found');
      }

      const isPlayer1 = match.player1SocketId === socket.id;
      const isPlayer2 = match.player2SocketId === socket.id;
      
      if (!isPlayer1 && !isPlayer2) {
        throw new Error('Player not in this match');
      }

      const playerNumber = isPlayer1 ? 1 : 2;
      const currentTurn = match.turns.length % 2 === 0 ? 1 : 2;
      
      if (playerNumber !== currentTurn) {
        throw new Error('Not your turn');
      }

      const board = GameService.deserializeBoard(match.board);
      
      if (!GameService.isValidMove(board, payload.move)) {
        throw new Error('Invalid move');
      }

      const newBoard = GameService.makeMove(board, payload.move);
      
      match.board = GameService.serializeBoard(newBoard);
      
      const result = GameService.getGameResult(newBoard);
      
      if (result !== null) {
        match.status = 'finished';
        match.result = result;
        match.finishedAt = new Date();
      }
      
      const savedMatch = await this.matchRepository.save(match);
      
      const turn = new Turn();
      turn.match = savedMatch;
      turn.playerNumber = playerNumber;
      turn.row = payload.move.row;
      turn.col = payload.move.col;
      await this.turnRepository.save(turn);
      
      const nextTurn = currentTurn === 1 ? 2 : 1;
      
      this.io.to(match.player1SocketId).emit(SocketEvents.MOVE_MADE, {
        gameId: match.id,
        move: payload.move,
        board: newBoard,
        currentTurn: result === null ? nextTurn : null
      });
      
      this.io.to(match.player2SocketId).emit(SocketEvents.MOVE_MADE, {
        gameId: match.id,
        move: payload.move,
        board: newBoard,
        currentTurn: result === null ? nextTurn : null
      });
      
      if (result !== null) {
        this.io.to(match.player1SocketId).emit(SocketEvents.GAME_END, {
          gameId: match.id,
          result,
          board: newBoard
        });
        
        this.io.to(match.player2SocketId).emit(SocketEvents.GAME_END, {
          gameId: match.id,
          result,
          board: newBoard
        });
        
        console.log(`Game ${match.id} ended with result: ${result}`);
      }
    } catch (error) {
      console.error('Error making move:', error);
      socket.emit(SocketEvents.ERROR, {
        message: error instanceof Error ? error.message : 'Failed to make move',
        code: 'MAKE_MOVE_ERROR'
      });
    }
  }

  private async handleLeaveGame(socket: Socket): Promise<void> {
    try {
      const matchesAsPlayer1 = await this.matchRepository.find({
        where: { player1SocketId: socket.id, status: 'in_progress' }
      });
      
      const matchesAsPlayer2 = await this.matchRepository.find({
        where: { player2SocketId: socket.id, status: 'in_progress' }
      });
      
      const matches = [...matchesAsPlayer1, ...matchesAsPlayer2];
      
      for (const match of matches) {
        match.status = 'finished';
        
        if (match.player1SocketId === socket.id) {
          match.result = 'player2_win';
          this.io.to(match.player2SocketId).emit(SocketEvents.GAME_END, {
            gameId: match.id,
            result: 'player2_win',
            board: GameService.deserializeBoard(match.board)
          });
        } else {
          match.result = 'player1_win';
          this.io.to(match.player1SocketId).emit(SocketEvents.GAME_END, {
            gameId: match.id,
            result: 'player1_win',
            board: GameService.deserializeBoard(match.board)
          });
        }
        
        match.finishedAt = new Date();
        await this.matchRepository.save(match);
      }
      
      const queueEntry = await this.queueRepository.findOne({
        where: { socketId: socket.id }
      });
      
      if (queueEntry) {
        await this.queueRepository.remove(queueEntry);
      }
    } catch (error) {
      console.error('Error handling leave game:', error);
    }
  }

  private async handleDisconnect(socket: Socket): Promise<void> {
    console.log(`Client disconnected: ${socket.id}`);
    await this.handleLeaveGame(socket);
  }
}
