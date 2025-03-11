import { Request, Response } from 'express';
import { promisePool } from '../../database/connection'; // Mise à jour de l'importation
import { RowDataPacket } from 'mysql2'; // Import des types nécessaires

export class QueueController {
  // Créer une queue
  static async createQueue(req: Request, res: Response): Promise<void> {
    const { ip, port } = req.body;

    if (!ip || !port) {
      res.status(400).send({ message: 'Les champs IP et port sont requis.' });
      return;
    }

    try {
      // Insérer une nouvelle queue dans la base de données
      await promisePool.query(
        'INSERT INTO queue (ip, port) VALUES (?, ?)', 
        [ip, port]
      );

      res.status(201).send({ message: 'Queue créée avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la création de la queue', error });
    }
  }
  
  // Lister toutes les files d'attentes
  static async getQueues(req: Request, res: Response): Promise<void> {
    try {
      const [queues] = await promisePool.query<RowDataPacket[]>(
        'SELECT id_queue, ip, port, is_chosen FROM queue'
      );

      res.status(200).send({ queues });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la récupération des files d\'attentes', error });
    }
  }

  // Choisir une file d'attente
  static async chooseQueue(req: Request, res: Response): Promise<void> {
    const { queueId } = req.params;

    try {
      // Choisir la file d'attente
      await promisePool.query(
        'UPDATE queue SET is_chosen = 1 WHERE id_queue = ?',
        [queueId]
      );

      res.status(200).send({ message: 'File d\'attente choisie avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors du choix de la file d\'attente', error });
    }
  }

  // Changer de file d'attente
  static async switchQueue(req: Request, res: Response): Promise<void> {
    const { queueId } = req.params;

    try {
      // Changer de file d'attente
      await promisePool.query(
        'UPDATE queue SET is_chosen = 0 WHERE id_queue = ?',
        [queueId]
      );

      res.status(200).send({ message: 'Changement de file d\'attente effectué avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors du changement de file d\'attente', error });
    }
  }

  // Ajouter un joueur à la file d'attente
  static async addPlayerToQueue(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      // Ajouter le joueur à la file d'attente
      await promisePool.query(
        'INSERT INTO queue (id_player, ip, port, date_entry) SELECT id_player, ?, ?, NOW() FROM players WHERE id_player = ?',
        [req.ip, req.socket.remotePort, playerId]
      );

      res.status(201).send({ message: 'Joueur ajouté à la file d\'attente.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de l\'ajout du joueur à la file d\'attente', error });
    }
  }

  // Lister tous les joueurs dans la file d'attente
  static async getPlayersInQueue(req: Request, res: Response): Promise<void> {
    try {
      const [queue] = await promisePool.query<RowDataPacket[]>(
        'SELECT id_player, pseudo, ip, port, date_entry FROM queue JOIN players ON queue.id_player = players.id_player'
      );

      res.status(200).send({ queue });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la récupération de la file d\'attente', error });
    }
  }

  // Mettre à jour une file d'attente
  static async updateQueue(req: Request, res: Response): Promise<void> {
    const { queueId } = req.params;
    const { ip, port } = req.body;

    if (!ip || !port) {
      res.status(400).send({ message: 'Les champs IP et port sont requis.' });
      return;
    }

    try {
      // Mettre à jour les informations de la queue dans la base de données
      await promisePool.query(
        'UPDATE queue SET ip = ?, port = ? WHERE id_queue = ?',
        [ip, port, queueId]
      );

      res.status(200).send({ message: 'Informations mises à jour dans la file d\'attente.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la mise à jour de la file d\'attente', error });
    }
  }

  // Retirer un joueur de la file d'attente
  static async removeFromQueue(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      // Vérifier si le joueur est dans la file d'attente
      const [existingQueue] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM queue WHERE id_player = ?', [playerId]
      );

      if (existingQueue.length === 0) {
        res.status(404).send({ message: 'Le joueur n\'est pas dans la file d\'attente.' });
        return;
      }

      // Supprimer le joueur de la file d'attente
      await promisePool.query('DELETE FROM queue WHERE id_player = ?', [playerId]);

      res.status(200).send({ message: 'Joueur retiré de la file d\'attente.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors du retrait de la file d\'attente', error });
    }
  }

  // Supprimer une file d'attente
  static async deleteQueue(req: Request, res: Response): Promise<void> {
    try {
      // Supprimer tous les joueurs de la file d'attente
      await promisePool.query('DELETE FROM queue');

      res.status(200).send({ message: 'File d\'attente supprimée.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la suppression de la file d\'attente', error });
    }
  }
}



