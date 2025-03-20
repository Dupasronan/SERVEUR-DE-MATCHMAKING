import { promisePool } from "../../database/connection";

export default class Turns {
  id_turn: number;
  id_match: number;
  id_player: number;
  position_played: number;
  played_at: Date;

  constructor(id_turn: number, id_match: number, id_player: number, position_played: number, played_at: Date) {
    this.id_turn = id_turn;
    this.id_match = id_match;
    this.id_player = id_player;
    this.position_played = position_played;
    this.played_at = played_at;
  }

  // Convertir l'instance en format JSON
  toJSON(): object {
    return {
      id_turn: this.id_turn,
      id_match: this.id_match,
      id_player: this.id_player,
      position_played: this.position_played,
      played_at: this.played_at.toISOString(),
    };
  }

  // Convertir une ligne de la base de données en instance de Turns
  static fromDB(row: any): Turns {
    return new Turns(row.id_turn, row.id_match, row.id_player, row.position_played, new Date(row.played_at));
  }

  // Créer un tour dans la base de données
  static async createTurn(id_match: number, id_player: number, position_played: number): Promise<void> {
    try {
      const query = "INSERT INTO turns (id_match, id_player, position_played, played_at) VALUES (?, ?,?, NOW())";
      await promisePool.query(query, [id_match, id_player, position_played]);
      console.log(`Tour créé: Match ${id_match}, Joueur ${id_player}, Position ${position_played}`);
    } catch (error) {
      console.error("Erreur lors de la création du tour :", error);
    }
  }

  // Enregistrer le tour dans la base de données
  static async recordTurn(id_match: number, id_player: number, position_played: number): Promise<void> {
    try {
      const query = "INSERT INTO turns (id_match, id_player, position_played, played_at) VALUES (?, ?, ?, NOW())";
      await promisePool.query(query, [id_match, id_player, position_played]);
      console.log(`Tour enregistré: Match ${id_match}, Joueur ${id_player}, Position ${position_played}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du tour :", error);
    }
  }

  // Récupérer tous les tours
  static async getAllTurns(): Promise<Turns[]> {
    try {
      const [rows] = await promisePool.query('SELECT * FROM turns');
      return (rows as any[]).map(Turns.fromDB);
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les tours :", error);
      throw new Error("Erreur lors de la récupération des tours");
    }
  }

  // Récupérer les tours par match
  static async getTurnsByMatch(id_match: number): Promise<Turns[]> {
    try {
      const [rows] = await promisePool.query('SELECT * FROM turns WHERE id_match =?', [id_match]);
      return (rows as any[]).map(Turns.fromDB);
    } catch (error) {
      console.error("Erreur lors de la récupération des tours par match :", error);
      throw new Error("Erreur lors de la récupération des tours");
    }
  }

  // Récupérer les tours par joueur
  static async getTurnsByPlayer(id_player: number): Promise<Turns[]> {
    try {
      const [rows] = await promisePool.query('SELECT * FROM turns WHERE id_player =?', [id_player]);
      return (rows as any[]).map(Turns.fromDB);
    } catch (error) {
      console.error("Erreur lors de la récupération des tours par joueur :", error);
      throw new Error("Erreur lors de la récupération des tours");
    }
  }

  // Supprimer un tour specifique pour un match
  static async deleteTurnByMatch(id_match: number, id_player: number): Promise<void> {
    try {
      await promisePool.query('DELETE FROM turns WHERE id_match =? AND id_player =?', [id_match, id_player]);
      console.log(`Tour supprimé: Match ${id_match}, Joueur ${id_player}`);
    } catch (error) {
      console.error("Erreur lors de la suppression du tour :", error);
    }
  }

  // Supprimer tous les tours d'un match
  static async deleteTurnsByMatch(id_match: number): Promise<void> {
    try {
      await promisePool.query('DELETE FROM turns WHERE id_match =?', [id_match]);
      console.log(`Tours supprimés: Match ${id_match}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les tours :", error);
    }
  }

  // Supprimer un tour spécifique d'un joueur
  static async deleteTurnByPlayer(id_player: number): Promise<void> {
    try {
      await promisePool.query('DELETE FROM turns WHERE id_player =?', [id_player]);
      console.log(`Tour supprimé: Joueur ${id_player}`);
    } catch (error) {
      console.error("Erreur lors de la suppression du tour :", error);
    }
  }

  // Supprimer tous les tours d'un joueur
  static async deleteTurnsByPlayer(id_player: number): Promise<void> {
    try {
      await promisePool.query('DELETE FROM turns WHERE id_player =?', [id_player]);
      console.log(`Tours supprimés: Joueur ${id_player}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les tours :", error);
    }
  }

  // Mettre à jour un tour
  static async updateTurn(id_turn: number, position_played: number): Promise<void> {
    try {
      await promisePool.query('UPDATE turns SET position_played =? WHERE id_turn =?', [position_played, id_turn]);
      console.log(`Tour mis à jour: Position ${position_played}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tour :", error);
    }
  }

  // Récupérer le prochain tour disponible pour un match
  static async getNextTurn(id_match: number): Promise<Turns | null> {
    try {
      const [row] = await promisePool.query('SELECT * FROM turns WHERE id_match =? AND position_played IS NULL ORDER BY played_at ASC LIMIT 1', [id_match]);
      return row? Turns.fromDB(row) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération du prochain tour :", error);
      return null;
    }
  }
  // Récupérer le prochain tour disponible pour un joueur
  static async getNextTurnByPlayer(id_player: number): Promise<Turns | null> {
    try {
      const [row] = await promisePool.query('SELECT * FROM turns WHERE id_player =? AND position_played IS NULL ORDER BY played_at ASC LIMIT 1', [id_player]);
      return row? Turns.fromDB(row) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération du prochain tour :", error);
      return null;
    }
  }

  // Récupérer le dernier tour joué pour un match
  static async getLastTurnByMatch(id_match: number): Promise<Turns | null> {
    try {
      const [row] = await promisePool.query('SELECT * FROM turns WHERE id_match =? ORDER BY played_at DESC LIMIT 1', [id_match]);
      return row? Turns.fromDB(row) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération du dernier tour :", error);
      return null;
    }
  }

  // Récupérer le dernier tour joué pour un joueur
  static async getLastTurnByPlayer(id_player: number): Promise<Turns | null> {
    try {
      const [row] = await promisePool.query('SELECT * FROM turns WHERE id_player =? ORDER BY played_at DESC LIMIT 1', [id_player]);
      return row? Turns.fromDB(row) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération du dernier tour :", error);
      return null;
    }
  }
}

