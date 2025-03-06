import { Players } from "./Players";
import { Matchs } from "./Matchs";

export class Turns {
  id_turn: number;
  match: Matchs;
  player: Players;
  position_played: number;
  played_at: Date;

  constructor(id_turn: number, match: Matchs, player: Players, position_played: number, played_at: Date) {
    this.id_turn = id_turn;
    this.match = match;
    this.player = player;
    this.position_played = position_played;
    this.played_at = played_at;
  }

  // Vérifier si un mouvement est valide
  static isValidMove(match: Matchs, position: number): boolean {
    return match.game_board[position] === "-";
  }

  // Appliquer un mouvement au plateau de jeu
  static applyMove(match: Matchs, turn: Turns): void {
    if (Turns.isValidMove(match, turn.position_played)) {
      let boardArray = match.game_board.split("");
      boardArray[turn.position_played] = turn.player.id_player === match.player1.id_player ? "X" : "O";
      match.game_board = boardArray.join("");
    } else {
      console.log("Mouvement invalide !");
    }
  }

  // Afficher le plateau de jeu
  static displayBoard(match: Matchs): void {
    console.log(`
      ${match.game_board[0]} | ${match.game_board[1]} | ${match.game_board[2]}
      ---------
      ${match.game_board[3]} | ${match.game_board[4]} | ${match.game_board[5]}
      ---------
      ${match.game_board[6]} | ${match.game_board[7]} | ${match.game_board[8]}
    `);
  }

  // Vérifier si un joueur a gagné
  static checkWinner(match: Matchs): boolean {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]  
    ];

    return winPatterns.some(pattern =>
      match.game_board[pattern[0]] !== "-" &&
      match.game_board[pattern[0]] === match.game_board[pattern[1]] &&
      match.game_board[pattern[1]] === match.game_board[pattern[2]]
    );
  }
}