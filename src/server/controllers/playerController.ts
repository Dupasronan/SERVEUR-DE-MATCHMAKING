import { Request, Response } from 'express';
import { promisePool } from '../../database/connection'; // Connexion MariaDB
import { RowDataPacket, ResultSetHeader } from 'mysql2'; // Types MySQL compatibles avec MariaDB

export class PlayerController {
  // Inscription d'un joueur
  static async registerPlayer(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.body;
    if (!pseudo) {
      res.status(400).send({ message: 'Veuillez fournir un pseudo.' });
      return;
    }

    try {
      const [existingPlayer] = await promisePool.query<RowDataPacket[]>(
        'SELECT id_player FROM players WHERE pseudo = ?', [pseudo]
      );

      if (existingPlayer.length > 0) {
        res.status(400).send({ message: 'Ce pseudo est déjà pris.' });
        return;
      }

      const [result] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO players (pseudo, created_at) VALUES (?, NOW())', [pseudo]
      );

      res.status(201).send({ message: 'Joueur inscrit avec succès.', playerId: result.insertId });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de l\'inscription du joueur', error });
    }
  }

  // Lister tous les joueurs
  static async getPlayers(req: Request, res: Response): Promise<void> {
    try {
      const [players] = await promisePool.query<RowDataPacket[]>('SELECT * FROM players');
      res.status(200).send({ players });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la récupération des joueurs.', error });
    }
  }

  // Récupérer un joueur par ID
  static async getPlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      const [player] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM players WHERE id_player = ?', [playerId]
      );

      if (player.length === 0) {
        res.status(404).send({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).send({ player: player[0] });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la récupération du joueur', error });
    }
  }

  // Modifier un joueur par ID
  static async updatePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    const { pseudo } = req.body;

    if (!pseudo) {
      res.status(400).send({ message: 'Le pseudo est requis.' });
      return;
    }

    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        'UPDATE players SET pseudo = ? WHERE id_player = ?', [pseudo, playerId]
      );

      if (result.affectedRows === 0) {
        res.status(404).send({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).send({ message: 'Pseudo mis à jour avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la mise à jour du pseudo', error });
    }
  }

  // Supprimer un joueur par ID
  static async deletePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM players WHERE id_player = ?', [playerId]
      );

      if (result.affectedRows === 0) {
        res.status(404).send({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).send({ message: 'Joueur supprimé avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la suppression du joueur', error });
    }
  }

  // Récupérer un joueur par pseudo
  static async getPlayerByPseudo(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.params;

    try {
      const [player] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM players WHERE pseudo = ?', [pseudo]
      );

      if (player.length === 0) {
        res.status(404).send({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).send({ player: player[0] });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la récupération du joueur', error });
    }
  }

  // Modifier un joueur par pseudo
  static async updatePlayerByPseudo(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.params;
    const { newPseudo } = req.body;

    if (!newPseudo) {
      res.status(400).send({ message: "Le nouveau pseudo est requis." });
      return;
    }

    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        'UPDATE players SET pseudo = ? WHERE pseudo = ?', [newPseudo, pseudo]
      );

      if (result.affectedRows === 0) {
        res.status(404).send({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).send({ message: 'Pseudo mis à jour avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la mise à jour du pseudo', error });
    }
  }

  // Supprimer un joueur par pseudo
  static async deletePlayerByPseudo(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.params;
    
    try {
      const [player] = await promisePool.query<RowDataPacket[]>('SELECT id_player FROM players WHERE pseudo = ?', [pseudo]);
      if (player.length === 0) {
        res.status(404).send({ message: "Joueur non trouvé." });
        return;
      }

      const [result] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM players WHERE pseudo = ?', [pseudo]
      );

      if (result.affectedRows === 0) {
        res.status(404).send({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).send({ message: "Joueur supprimé avec succès." }); 
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la suppression du joueur', error });
    }
  }

  // Récupérer le prochain joueur à jouer
  static async getNextPlayer(req: Request, res: Response): Promise<void> {
    try {
      const [nextPlayer] = await promisePool.query<RowDataPacket[]>(
        `SELECT players.id_player, players.pseudo 
         FROM players 
         INNER JOIN queue ON players.id_player = queue.id_player 
         WHERE queue.priority = (SELECT MIN(priority) FROM queue)`
      );

      if (nextPlayer.length === 0) {
        res.status(404).send({ message: 'Aucun joueur disponible pour jouer.' });
        return;
      }

      res.status(200).send({ nextPlayer: nextPlayer[0] });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la récupération du prochain joueur.', error });
    }
  }
}

