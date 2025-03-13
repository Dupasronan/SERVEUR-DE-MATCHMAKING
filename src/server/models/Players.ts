import { promisePool } from '../../database/connection';
import { RowDataPacket, OkPacket } from 'mysql2';

export class Players {
  id_player: number;
  pseudo: string;
  created_at: Date;

  constructor(id_player: number, pseudo: string, created_at: Date) {
    this.id_player = id_player;
    this.pseudo = pseudo;
    this.created_at = created_at;
  }

  // Afficher les informations du joueur
  displayInfo(): void {
    console.log(`ID: ${this.id_player}, Pseudo: ${this.pseudo}, Créé le: ${this.created_at}`);
  }

  // Modifier le pseudo du joueur, avec une validation stricte
  updatePseudo(newPseudo: string): void {
    if (newPseudo.trim().length === 0) {
      console.log("Le pseudo ne peut pas être vide ou constitué uniquement d'espaces !");
      return;
    }

    if (newPseudo === this.pseudo) {
      console.log("Le nouveau pseudo est identique à l'ancien.");
      return;
    }

    this.pseudo = newPseudo;
    console.log(`Pseudo mis à jour : ${this.pseudo}`);
  }

  // Comparer deux joueurs
  isEqual(otherPlayer: Players): boolean {
    return this.id_player === otherPlayer.id_player;
  }

  // Créer un joueur depuis une ligne de base de données
  static fromDB(row: RowDataPacket): Players {
    if (!row.id_player || !row.pseudo || !row.created_at) {
      throw new Error("Données manquantes pour créer un joueur");
    }

    return new Players(row.id_player, row.pseudo, new Date(row.created_at));
  }

  // Convertir l'objet joueur en un format compatible avec la base de données
  toDB(): any {
    return {
      id_player: this.id_player,
      pseudo: this.pseudo,
      created_at: this.created_at.toISOString(),
    };
  }

  // Vérifier si un joueur a été créé dans les 24 dernières heures
  wasCreatedRecently(): boolean {
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
    return new Date().getTime() - this.created_at.getTime() <= twentyFourHoursInMs;
  }

  // Récupérer les informations de joueur sous forme d'objet JSON
  toJSON(): object {
    return {
      id_player: this.id_player,
      pseudo: this.pseudo,
      created_at: this.created_at.toISOString(),
    };
  }

  // Récupérer un joueur à partir de l'ID depuis la base de données
  static async getById(id: number): Promise<Players | null> {
    try {
      const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM players WHERE id_player = ?',
        [id]
      );
      return rows.length > 0 ? this.fromDB(rows[0]) : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du joueur par ID : ${error}`);
      throw error;
    }
  }

  // Ajouter un joueur dans la base de données
  static async addNewPlayer(pseudo: string): Promise<Players> {
    try {
      const [result] = await promisePool.query<OkPacket>(
        'INSERT INTO players (pseudo) VALUES (?)',
        [pseudo]
      );
      const id_player = result.insertId;
      return new Players(id_player, pseudo, new Date());
    } catch (error) {
      console.error(`Erreur lors de l'ajout du joueur : ${error}`);
      throw error;
    }
  }

  // Récupérer un joueur par pseudo
static async getByPseudo(pseudo: string): Promise<Players | null> {
  try {
    const [rows] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM players WHERE pseudo = ?', [pseudo]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.fromDB(rows[0]); // Convertir en instance de Players
  } catch (error) {
    console.error('Erreur lors de la récupération du joueur par pseudo :', error);
    throw error;
  }
}


  // Mettre à jour un joueur dans la base de données
  static async updatePlayer(player: Players): Promise<void> {
    try {
      await promisePool.query<OkPacket>(
        'UPDATE players SET pseudo = ? WHERE id_player = ?',
        [player.pseudo, player.id_player]
      );
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du joueur : ${error}`);
      throw error;
    }
  }

  // Supprimer un joueur par ID
  static async deletePlayer(playerId: number): Promise<void> {
    try {
      await promisePool.query('DELETE FROM players WHERE id_player = ?', [playerId]);
    } catch (error) {
      console.error(`Erreur lors de la suppression du joueur : ${error}`);
      throw error;
    }
  }

  // Récupérer tous les joueurs sous forme d'objets JSON
  static async getAllPlayers(): Promise<object[]> {
    try {
      const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM players'
      );
      return rows.map(row => this.fromDB(row).toJSON());
    } catch (error) {
      console.error(`Erreur lors de la récupération des joueurs : ${error}`);
      throw error;
    }
  }
}

