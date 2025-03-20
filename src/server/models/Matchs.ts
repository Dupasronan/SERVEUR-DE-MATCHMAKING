import { Players, Player } from "../models/Players";
import { promisePool } from "../../database/connection";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class Matchs {
  id_match: number;
  player1: Player;
  player2: Player;
  game_board: string;
  status: "pending" | "in_progress" | "finished";
  id_winner: number | null;
  current_turn: number;
  created_at: Date;

  constructor(
    id_match: number,
    player1: Player,
    player2: Player,
    game_board: string = "---------",
    status: "pending" | "in_progress" | "finished" = "pending",
    id_winner: number | null = null,
    current_turn: number = 1,
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

  // Fonction pour vérifier si un joueur a gagné
  static checkWin(gameBoard: string[], playerMark: string): boolean {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes horizontales
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // lignes verticales
      [0, 4, 8], [2, 4, 6], // diagonales
    ];

    return winPatterns.some(pattern =>
      pattern.every(index => gameBoard[index] === playerMark)
    );
  }

  // Créer un match entre deux joueurs
  static async createMatch(player1Id: number, player2Id: number): Promise<Matchs | null> {
    try {
      const player1 = await Players.getById(player1Id);
      const player2 = await Players.getById(player2Id);

      if (!player1 || !player2) {
        throw new Error("Un ou plusieurs joueurs non trouvés.");
      }

      const [queuePlayers] = await promisePool.query<RowDataPacket[]>(
        'SELECT id_player FROM queue WHERE id_player IN (?, ?)', 
        [player1Id, player2Id]
      );

      if (queuePlayers.length < 2) {
        throw new Error(`Les joueurs suivants ne sont pas dans la file d'attente.`);
      }

      const [result] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO matchs (id_player1, id_player2, game_board, status) VALUES (?, ?, ?, ?)',
        [player1Id, player2Id, '---------', 'pending']
      );

      const match = await Matchs.fromDBWithPlayers(result.insertId);

      return match;
    } catch (error) {
      console.error("Erreur lors de la création du match:", error);
      return null;
    }
  }

  // Lancer un match
  static async startMatch(matchId: number): Promise<Matchs | null> {
    try {
      const [match] = await promisePool.query<RowDataPacket[]>('SELECT * FROM matchs WHERE id_match = ?', [matchId]);

      if (!match.length) {
        throw new Error("Match non trouvé.");
      }

      if (match[0].status !== 'pending') {
        throw new Error('Le match ne peut pas être lancé, il n\'est pas dans l\'état "en attente".');
      }

      const matchWithPlayers = await Matchs.fromDBWithPlayers(match[0]);
      await promisePool.query('UPDATE matchs SET status = ? WHERE id_match = ?', ['in_progress', matchId]);
      
      return matchWithPlayers;
    } catch (error) {
      console.error("Erreur lors du lancement du match:", error);
      return null;
    }
  }

  // Mettre à jour le match après un mouvement
  static async updateMatch(matchId: number, playerId: number, position: number): Promise<Matchs | null> {
    try {
      const [match] = await promisePool.query<RowDataPacket[]>('SELECT game_board, status FROM matchs WHERE id_match = ?', [matchId]);

      if (!match.length) {
        throw new Error('Match non trouvé.');
      }

      if (match[0].status !== 'in_progress') {
        throw new Error('Le match n\'est pas en cours.');
      }

      const gameBoard = match[0].game_board.split('');
      const playerMark = playerId === match[0].id_player1 ? 'X' : 'O';

      if (gameBoard[position] !== '-') {
        throw new Error('La case est déjà occupée.');
      }

      gameBoard[position] = playerMark;

      if (Matchs.checkWin(gameBoard, playerMark)) {
        await promisePool.query(
          'UPDATE matchs SET game_board = ?, status = ?, id_winner = ? WHERE id_match = ?',
          [gameBoard.join(''), 'finished', playerId, matchId] 
        );
      } else {
        await promisePool.query(
          'UPDATE matchs SET game_board = ? WHERE id_match = ?',
          [gameBoard.join(''), matchId]
        );
      }

      return await Matchs.fromDBWithPlayers(match[0]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du match:", error);
      return null;
    }
  }

  // Supprimer un match
  static async deleteMatch(matchId: number): Promise<boolean> {
    try {
      await promisePool.query('DELETE FROM matchs WHERE id_match = ?', [matchId]);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du match:", error);
      return false;
    }
  }

  // Créer un match depuis la base de données en récupérant les joueurs
  static async fromDBWithPlayers(row: any): Promise<Matchs> {
    const player1 = await Players.getById(row.id_player1);
    const player2 = await Players.getById(row.id_player2);

    if (!player1 || !player2) {
      throw new Error("Un ou plusieurs joueurs non trouvés.");
    }

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

  // Méthode pour récupérer un match avec les joueurs associés
  static async getMatchById(matchId: number): Promise<Matchs | null> {
    try {
      const [match] = await promisePool.query<RowDataPacket[]>('SELECT * FROM matchs WHERE id_match = ?', [matchId]);

      if (!match.length) {
        throw new Error('Match non trouvé.');
      }

      return await Matchs.fromDBWithPlayers(match[0]);
    } catch (error) {
      console.error("Erreur lors de la récupération du match:", error);
      return null;
    }
  }

  // Vérifier si un joueur est dans un match (méthode d'instance)
  isPlayerInMatch(playerId: number): boolean {
    return playerId === this.player1.id || playerId === this.player2.id;
  }

  // Vérifier si un match est terminé (méthode d'instance)
  isMatchOver(): boolean {
    return this.status === "finished";
  }

  // Réinitialiser le tableau de jeu (méthode d'instance)
  resetBoard(): void {
    this.game_board = "---------";
    this.status = "pending";
    this.id_winner = null;
    this.current_turn = 1;
  }

  // Déclarer un gagnant
  declareWinner(winnerId: number): void {
    this.id_winner = winnerId;
    this.status = "finished";  // Mettre à jour l'état du match en "terminé"
  }
}



