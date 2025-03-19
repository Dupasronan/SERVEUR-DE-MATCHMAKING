export type CellValue = 'X' | 'O' | null;
export type GameBoard = CellValue[][];
export type GameStatus = 'waiting' | 'in_progress' | 'finished';
export type GameResult = 'player1_win' | 'player2_win' | 'draw' | null;

export interface Player {
  id: string;
  nickname: string;
  socketId: string;
}

export interface GameMove {
  row: number;
  col: number;
  player: 1 | 2;
}

export enum SocketEvents {
  JOIN_QUEUE = 'join_queue',
  MAKE_MOVE = 'make_move',
  LEAVE_GAME = 'leave_game',
  MATCH_FOUND = 'match_found',
  GAME_START = 'game_start',
  MOVE_MADE = 'move_made',
  GAME_END = 'game_end',
  ERROR = 'error'
}

export interface JoinQueuePayload {
  nickname: string;
}

export interface MatchFoundPayload {
  opponent: Player;
  playerNumber: 1 | 2;
}

export interface GameStartPayload {
  gameId: string;
  board: GameBoard;
  currentTurn: 1 | 2;
}

export interface MakeMovePayload {
  gameId: string;
  move: GameMove;
}

export interface MoveMadePayload {
  gameId: string;
  move: GameMove;
  board: GameBoard;
  currentTurn: 1 | 2;
}

export interface GameEndPayload {
  gameId: string;
  result: GameResult;
  board: GameBoard;
}

export interface ErrorPayload {
  message: string;
  code: string;
}
