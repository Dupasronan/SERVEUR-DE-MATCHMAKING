import { Players } from "./Players";

export class Matchs {
  id_match: number;
  player1: Players;
  player2: Players;
  game_board: string;
  status: "pending" | "in_progress" | "finished";
  winner: number | null; // Utilisation de l'ID du gagnant plutôt qu'un objet Players
  created_at: Date;

  constructor(
    id_match: number,
    player1: Players,
    player2: Players,
    game_board: string = "---------",
    status: "pending" | "in_progress" | "finished" = "pending",
    winner: number | null = null, // Utilisation de l'ID du gagnant
    created_at: Date
  ) {
    this.id_match = id_match;
    this.player1 = player1;
    this.player2 = player2;
    this.game_board = game_board;
    this.status = status;
    this.winner = winner;
    this.created_at = created_at;
  }

  // Vérifier si un joueur participe au match
  isPlayerInMatch(playerId: number): boolean {
    return this.player1.id_player === playerId || this.player2.id_player === playerId;
  }

  // Vérifier si le match est terminé
  isMatchOver(): boolean {
    return this.status === "finished";
  }

  // Déclarer un gagnant
  declareWinner(winner: number): void { // Le gagnant est un ID de joueur
    this.winner = winner;
    this.status = "finished";
    console.log(`Le gagnant est le joueur avec l'ID ${winner}`);
  }

  // Réinitialiser le plateau
  resetBoard(): void {
    this.game_board = "---------";
    this.status = "pending";
    this.winner = null;
  }

  // Créer un match depuis une base de données
  static fromDB(row: any, player1: Players, player2: Players): Matchs {
    return new Matchs(
      row.id_match,
      player1,
      player2,
      row.game_board,
      row.status,
      row.id_winner, // Utilisation de l'ID du gagnant
      new Date(row.created_at)
    );
  }
}
