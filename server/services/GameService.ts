import { GameBoard, GameMove, GameResult } from '../../shared/types';

export class GameService {
  private static readonly BOARD_SIZE = 3;

  static createEmptyBoard(): GameBoard {
    return Array(this.BOARD_SIZE)
      .fill(null)
      .map(() => Array(this.BOARD_SIZE).fill(null));
  }

  static isValidMove(board: GameBoard, move: GameMove): boolean {
    if (
      move.row < 0 ||
      move.row >= this.BOARD_SIZE ||
      move.col < 0 ||
      move.col >= this.BOARD_SIZE
    ) {
      return false;
    }

    return board[move.row][move.col] === null;
  }

  static makeMove(board: GameBoard, move: GameMove): GameBoard {
    if (!this.isValidMove(board, move)) {
      throw new Error('Invalid move');
    }

    const newBoard = board.map(row => [...row]);
    newBoard[move.row][move.col] = move.player === 1 ? 'X' : 'O';
    return newBoard;
  }

  static isBoardFull(board: GameBoard): boolean {
    return board.every(row => row.every(cell => cell !== null));
  }

  static checkWinner(board: GameBoard): 1 | 2 | null {
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      if (
        board[row][0] !== null &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2]
      ) {
        return board[row][0] === 'X' ? 1 : 2;
      }
    }

    for (let col = 0; col < this.BOARD_SIZE; col++) {
      if (
        board[0][col] !== null &&
        board[0][col] === board[1][col] &&
        board[1][col] === board[2][col]
      ) {
        return board[0][col] === 'X' ? 1 : 2;
      }
    }

    if (
      board[0][0] !== null &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0] === 'X' ? 1 : 2;
    }

    if (
      board[0][2] !== null &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2] === 'X' ? 1 : 2;
    }

    return null;
  }

  static getGameResult(board: GameBoard): GameResult {
    const winner = this.checkWinner(board);
    
    if (winner === 1) {
      return 'player1_win';
    } else if (winner === 2) {
      return 'player2_win';
    } else if (this.isBoardFull(board)) {
      return 'draw';
    }
    
    return null; 
  }

  static serializeBoard(board: GameBoard): (string | null)[][] {
    return board.map(row => [...row]);
  }

  static deserializeBoard(board: (string | null)[][]): GameBoard {
    return board.map(row => row.map(cell => {
      if (cell === 'X' || cell === 'O') {
        return cell;
      }
      return null;
    }));
  }
}
