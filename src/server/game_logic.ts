import { Matchs } from "./models/Matchs";
import Turns from "./models/Turns";
import { Player } from "./models/Players"; // Utilisation de l'interface Player

export class GameLogic {
  // Créer un nouveau match
  static startNewMatch(player1: Player, player2: Player): Matchs {
    return new Matchs(0, player1, player2, "---------", "pending", null, player1.id_player, new Date());
  }

  // Jouer un tour et enregistrer dans Turns
  static async playTurn(match: Matchs, player: Player, position: number): Promise<boolean> {
    if (!this.isValidMove(match.game_board, position)) {
      return false;
    }

    // Déterminer qui joue avec "X" et "O"
    const isPlayer1 = player.id_player === match.player1.id_player;
    const symbol = isPlayer1 ? "X" : "O";

    // Appliquer le mouvement
    match.game_board = this.applyMove(match.game_board, position, symbol);

    // Enregistrer le tour dans la base de données
    await Turns.recordTurn(match.id_match, player.id_player, position);

    // Vérifier s'il y a un gagnant
    const winner = this.checkWinner(match.game_board);
    if (winner) {
      match.declareWinner(player.id_player);
    } else {
      // Passer au tour suivant
      match.current_turn = isPlayer1 ? match.player2.id_player : match.player1.id_player;
    }

    return true;
  }

  // Vérifier si le mouvement est valide
  static isValidMove(board: string, position: number): boolean {
    return position >= 0 && position < 9 && board[position] === "-";
  }

  // Appliquer le mouvement sur le plateau
  static applyMove(board: string, position: number, symbol: string): string {
    return board.substring(0, position) + symbol + board.substring(position + 1);
  }

  // Vérifier le gagnant
  static checkWinner(board: string): string | null {
    const patterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
      [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    for (const [a, b, c] of patterns) {
      if (board[a] !== "-" && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  // Vérifier si le plateau est plein (égalité)
  static isBoardFull(board: string): boolean {
    return !board.includes("-");
  }
}
