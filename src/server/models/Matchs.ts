import { Players } from "./Players";

export class Matchs {
  id_match: number;
  player1: Players;
  player2: Players;
  game_board: string;
  status: "pending" | "in_progress" | "finished";
  winner: Players | null;
  created_at: Date;

  constructor(
    id_match: number,
    player1: Players,
    player2: Players,
    game_board: string = "---------",
    status: "pending" | "in_progress" | "finished" = "pending",
    winner: Players | null = null,
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
  declareWinner(winner: Players): void {
    this.winner = winner;
    this.status = "finished";
    console.log(`Le gagnant est ${winner.pseudo}`);
  }

  // Réinitialiser le plateau
  resetBoard(): void {
    this.game_board = "---------";
    this.status = "pending";
    this.winner = null;
  }

  // Créer un match depuis une base de données
  static fromDB(row: any, player1: Players, player2: Players): Matchs {
    return new Matchs(row.id_match, player1, player2, row.game_board, row.status, row.winner ? new Players(row.winner, "", new Date()) : null, new Date(row.created_at));
  }
}


