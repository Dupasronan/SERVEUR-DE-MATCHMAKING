import { promisePool } from '../../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Player extends RowDataPacket {
  id_player: number;
  pseudo: string;
  created_at: Date;
}

export class Players {
  id_player: number;
  pseudo: string;
  created_at: Date;

  constructor(id_player: number, pseudo: string, created_at: Date) {
    this.id_player = id_player;
    this.pseudo = pseudo;
    this.created_at = created_at;
  }

  // Créer un Player et retourner son ID
  static async createPlayer(pseudo: string): Promise<number | null> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO players (pseudo, created_at) VALUES (?, NOW())',
        [pseudo]
      );
      return result.insertId;
    } catch (error) {
      console.error(`Erreur lors de la création du joueur "${pseudo}":`, error);
      return null;
    }
  }

  // Récupérer un joueur par son ID
  static async getById(id_player: number): Promise<Player | null> {
    try {
      const [rows] = await promisePool.query<Player[]>('SELECT * FROM players WHERE id_player = ?', [id_player]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du joueur avec l'ID ${id_player}:`, error);
      return null;
    }
  }

  // Récupérer tous les joueurs
  static async getAllPlayers(): Promise<Player[]> {
    try {
      const [rows] = await promisePool.query<Player[]>('SELECT * FROM players');
      return rows;
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les joueurs:", error);
      return [];
    }
  }

  // Récupérer un joueur par son pseudo
  static async getByPseudo(pseudo: string): Promise<Player | null> {
    try {
      const [rows] = await promisePool.query<Player[]>('SELECT * FROM players WHERE pseudo = ?', [pseudo]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du joueur avec le pseudo "${pseudo}":`, error);
      return null;
    }
  }

  // Mettre à jour un joueur par son ID
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

  // Supprimer un joueur par son ID
  static async deletePlayer(id_player: number): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>('DELETE FROM players WHERE id_player = ?', [id_player]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la suppression du joueur avec l'ID ${id_player}:`, error);
      return false;
    }
  }

  // Mise à jour du pseudo d'un joueur en utilisant son pseudo actuel
  static async updatePlayerByPseudo(currentPseudo: string, newPseudo: string): Promise<boolean> {
    try {
      const player = await Players.getByPseudo(currentPseudo);
      if (!player) {
        return false;  // Le joueur n'existe pas
      }
      const [result] = await promisePool.query<ResultSetHeader>(
        'UPDATE players SET pseudo = ? WHERE id_player = ?',
        [newPseudo, player.id_player]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du joueur avec le pseudo "${currentPseudo}":`, error);
      return false;
    }
  }
}

