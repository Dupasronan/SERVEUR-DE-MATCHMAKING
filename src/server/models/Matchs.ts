import { Players } from "../models/Players";

export class Matchs {
  id_match: number;
  player1: Players;
  player2: Players;
  game_board: string;
  status: "pending" | "in_progress" | "finished";
  id_winner: number | null; // ID du gagnant
  current_turn: number; // ID du joueur dont c'est le tour
  created_at: Date;

  constructor(
    id_match: number,
    player1: Players,
    player2: Players,
    game_board: string = "---------",
    status: "pending" | "in_progress" | "finished" = "pending",
    id_winner: number | null = null,
    current_turn: number = 1, // Joueur 1 commence
    created_at: Date
  ) {
    this.id_match = id_match;
    this.player1 = player1;
    this.player2 = player2;
    this.game_board = game_board;
    this.status = status;
    this.id_winner = id_winner;
    this.current_turn = current_turn;
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
  declareWinner(winner: number): void {
    this.id_winner = winner;
    this.status = "finished";
    console.log(`Le gagnant est le joueur avec l'ID ${winner}`);
  }

  // Réinitialiser le plateau
  resetBoard(): void {
    this.game_board = "---------";
    this.status = "pending";
    this.id_winner = null;
  }

  // Créer un match depuis une base de données
  static fromDB(row: any, player1: Players, player2: Players): Matchs {
    return new Matchs(
      row.id_match,
      player1,
      player2,
      row.game_board,
      row.status,
      row.id_winner,
      row.current_turn,
      new Date(row.created_at)
    );
  }

  // Créer un match depuis la base de données en récupérant les joueurs
  static async fromDBWithPlayers(row: any): Promise<Matchs> {
    // Récupérer les joueurs en utilisant leurs IDs
    const player1 = await Players.getById(row.id_player1);
    const player2 = await Players.getById(row.id_player2);

    if (!player1 || !player2) {
      throw new Error("Un ou plusieurs joueurs non trouvés.");
    }

    return this.fromDB(row, player1, player2);
  }
}
