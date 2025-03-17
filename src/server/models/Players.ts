import { promisePool } from '../../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Player extends RowDataPacket {
  id_player: number;
  pseudo: string;
  created_at: Date;
}

export class Players {
  
  static async getById(id_player: number): Promise<Player | null> {
    try {
      const [rows] = await promisePool.query<Player[]>(
        'SELECT * FROM players WHERE id_player = ?', 
        [id_player]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du joueur avec l'ID ${id_player}:`, error);
      return null;
    }
  }

  static async create(pseudo: string): Promise<number | null> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO players (pseudo) VALUES (?)',
        [pseudo]
      );
      return result.insertId;
    } catch (error) {
      console.error(`Erreur lors de la création du joueur avec le pseudo "${pseudo}":`, error);
      return null;
    }
  }

  static async exists(pseudo: string): Promise<boolean> {
    try {
      const [rows] = await promisePool.query<Player[]>(
        'SELECT id_player FROM players WHERE pseudo = ?', 
        [pseudo]
      );
      return rows.length > 0;
    } catch (error) {
      console.error(`Erreur lors de la vérification du pseudo "${pseudo}":`, error);
      return false;
    }
  }

  static async getAllPlayers(): Promise<Player[]> {
    try {
      const [rows] = await promisePool.query<Player[]>(
        'SELECT * FROM players'
      );
      return rows;
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les joueurs:", error);
      return [];
    }
  }

  static async getByPseudo(pseudo: string): Promise<Player | null> {
    try {
      const [rows] = await promisePool.query<Player[]>(
        'SELECT * FROM players WHERE pseudo = ?', 
        [pseudo]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du joueur avec le pseudo "${pseudo}":`, error);
      return null;
    }
  }

  static async updatePlayer(id_player: number, pseudo: string): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        'UPDATE players SET pseudo = ? WHERE id_player = ?',
        [pseudo, id_player]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du joueur avec l'ID ${id_player}:`, error);
      return false;
    }
  }

  static async deletePlayer(id_player: number): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM players WHERE id_player = ?',
        [id_player]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la suppression du joueur avec l'ID ${id_player}:`, error);
      return false;
    }
  }
}


