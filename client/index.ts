import * as readline from 'readline';
import { io, Socket } from 'socket.io-client';
import { 
  SocketEvents, 
  GameBoard, 
  GameMove, 
  MatchFoundPayload, 
  GameStartPayload, 
  MoveMadePayload, 
  GameEndPayload 
} from '../shared/types';

class TicTacToeClient {
  private socket: Socket;
  private rl: readline.Interface;
  private nickname: string = '';
  private currentGameId: string | null = null;
  private isMyTurn: boolean = false;
  private playerNumber: 1 | 2 = 1;
  private currentBoard: GameBoard | null = null;
  private opponent: string = '';

  constructor(serverUrl: string = 'http://localhost:3000') {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.socket = io(serverUrl);
    
    this.setupSocketHandlers();
    
    this.start();
  }

  private setupSocketHandlers(): void {
    this.socket.on(SocketEvents.MATCH_FOUND, (payload: MatchFoundPayload) => 
      this.handleMatchFound(payload));
    
    this.socket.on(SocketEvents.GAME_START, (payload: GameStartPayload) => 
      this.handleGameStart(payload));
    
    this.socket.on(SocketEvents.MOVE_MADE, (payload: MoveMadePayload) => 
      this.handleMoveMade(payload));
    
    this.socket.on(SocketEvents.GAME_END, (payload: GameEndPayload) => 
      this.handleGameEnd(payload));
    
    this.socket.on(SocketEvents.ERROR, (error) => {
      console.log(`\x1b[31mError: ${error.message}\x1b[0m`);
    });
  }

  private start(): void {
    console.log('=== Tic Tac Toe Game ===');
    this.askForNickname();
  }

  private askForNickname(): void {
    this.rl.question('Enter your nickname: ', (nickname) => {
      if (nickname.trim() !== '') {
        this.nickname = nickname.trim();
        console.log(`Welcome, ${this.nickname}!`);
        this.joinQueue();
      } else {
        console.log('Nickname cannot be empty');
        this.askForNickname();
      }
    });
  }

  private joinQueue(): void {
    console.log('Joining matchmaking queue...');
    this.socket.emit(SocketEvents.JOIN_QUEUE, { nickname: this.nickname });
    console.log('Waiting for an opponent...');
  }

  private handleMatchFound(payload: MatchFoundPayload): void {
    this.opponent = payload.opponent.nickname;
    this.playerNumber = payload.playerNumber;
    console.log(`\x1b[32mMatch found! You are playing against ${this.opponent}\x1b[0m`);
    console.log(`You are Player ${this.playerNumber} (${this.playerNumber === 1 ? 'X' : 'O'})`);
  }

  private handleGameStart(payload: GameStartPayload): void {
    this.currentGameId = payload.gameId;
    this.currentBoard = payload.board;
    this.isMyTurn = payload.currentTurn === this.playerNumber;
    
    console.log('\x1b[32mGame has started!\x1b[0m');
    this.displayBoard();
    
    if (this.isMyTurn) {
      console.log('\x1b[33mIt\'s your turn!\x1b[0m');
      this.askForMove();
    } else {
      console.log(`Waiting for ${this.opponent}'s move...`);
    }
  }

  private handleMoveMade(payload: MoveMadePayload): void {
    if (payload.gameId !== this.currentGameId) return;
    
    this.currentBoard = payload.board;
    this.isMyTurn = payload.currentTurn === this.playerNumber;
    
    const playerWhoMoved = payload.move.player;
    const moveStr = `Row ${payload.move.row + 1}, Column ${payload.move.col + 1}`;
    
    if (playerWhoMoved === this.playerNumber) {
      console.log(`You played: ${moveStr}`);
    } else {
      console.log(`${this.opponent} played: ${moveStr}`);
    }
    
    this.displayBoard();
    
    if (this.isMyTurn) {
      console.log('\x1b[33mIt\'s your turn!\x1b[0m');
      this.askForMove();
    } else if (payload.currentTurn !== null) {
      console.log(`Waiting for ${this.opponent}'s move...`);
    }
  }

  private handleGameEnd(payload: GameEndPayload): void {
    if (payload.gameId !== this.currentGameId) return;
    
    this.currentBoard = payload.board;
    this.displayBoard();
    
    if (payload.result === 'player1_win' && this.playerNumber === 1) {
      console.log('\x1b[32mCongratulations! You won the game!\x1b[0m');
    } else if (payload.result === 'player2_win' && this.playerNumber === 2) {
      console.log('\x1b[32mCongratulations! You won the game!\x1b[0m');
    } else if (payload.result === 'draw') {
      console.log('\x1b[33mThe game ended in a draw!\x1b[0m');
    } else {
      console.log('\x1b[31mYou lost the game.\x1b[0m');
    }
    
    this.askToPlayAgain();
  }

  private askForMove(): void {
    if (!this.currentBoard) return;
    
    this.rl.question('Enter your move (row,col) - e.g. 1,1 for center: ', (input) => {
      const [rowStr, colStr] = input.split(',');
      const row = parseInt(rowStr) - 1;
      const col = parseInt(colStr) - 1;
      
      if (
        isNaN(row) || 
        isNaN(col) || 
        row < 0 || 
        row > 2 || 
        col < 0 || 
        col > 2 ||
        (this.currentBoard && this.currentBoard[row][col] !== null)
      ) {
        console.log('\x1b[31mInvalid move. Try again.\x1b[0m');
        this.askForMove();
        return;
      }
      
      const move: GameMove = {
        row,
        col,
        player: this.playerNumber
      };
      
      this.socket.emit(SocketEvents.MAKE_MOVE, {
        gameId: this.currentGameId,
        move
      });
    });
  }

  private askToPlayAgain(): void {
    this.rl.question('Do you want to play again? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        this.currentGameId = null;
        this.currentBoard = null;
        this.isMyTurn = false;
        this.joinQueue();
      } else {
        console.log('Thanks for playing!');
        this.socket.disconnect();
        this.rl.close();
        process.exit(0);
      }
    });
  }

  private displayBoard(): void {
    if (!this.currentBoard) return;
    
    console.log('  1 2 3');
    console.log(' -------');
    
    for (let row = 0; row < 3; row++) {
      let rowStr = `${row + 1}|`;
      
      for (let col = 0; col < 3; col++) {
        const cell = this.currentBoard[row][col];
        if (cell === 'X') {
          rowStr += 'X';
        } else if (cell === 'O') {
          rowStr += 'O';
        } else {
          rowStr += ' ';
        }
        
        if (col < 2) {
          rowStr += '|';
        }
      }
      
      rowStr += '|';
      console.log(rowStr);
      
      if (row < 2) {
        console.log(' |-----|');
      }
    }
    
    console.log(' -------');
  }
}

const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
new TicTacToeClient(serverUrl);
