import { Request, Response } from 'express';
import { promisePool } from '../../database/connection';
import { RowDataPacket } from 'mysql2';
import { Queue } from '../models/Queue';
import { Players } from '../models/Players';

export class QueueController {
  /**
   * Ajouter un joueur à la file d'attente
   */
  static async addPlayerToQueue(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    const { priority } = req.body;
    const ip = req.ip;
    const port = req.socket.remotePort;

    if (!priority) {
      res.status(400).send({ message: 'La priorité est requise.' });
      return;
    }

    try {
      // Vérifier si le joueur existe
      const [playerRows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM players WHERE id_player = ?', [playerId]
      );
      if (playerRows.length === 0) {
        res.status(404).send({ message: 'Joueur non trouvé.' });
        return;
      }

      // Créer une instance de Players
      const player = new Players(playerRows[0].id_player, playerRows[0].pseudo, playerRows[0].created_at);

      // Vérifier si le joueur est déjà dans la queue
      const [existingQueue] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM queue WHERE id_player = ?', [playerId]
      );
      if (existingQueue.length > 0) {
        res.status(409).send({ message: 'Le joueur est déjà dans la file d\'attente.' });
        return;
      }

      // Ajouter le joueur dans la queue
      await promisePool.query(
        'INSERT INTO queue (id_player, ip, port, date_entry, priority) VALUES (?, ?, ?, NOW(), ?)',
        [playerId, ip, port, priority]
      );

      res.status(201).send({ message: `Joueur ${player.pseudo} ajouté à la file d'attente.` });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de l\'ajout du joueur à la file d\'attente', error });
    }
  }

  /**
   * Récupérer tous les joueurs dans la file d'attente
   */
  static async getPlayersInQueue(req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await promisePool.query<RowDataPacket[]>(`
        SELECT q.id, q.ip, q.port, q.date_entry, q.priority, p.id_player, p.pseudo, p.created_at 
        FROM queue q
        JOIN players p ON q.id_player = p.id_player
        ORDER BY q.priority ASC, q.date_entry ASC
      `);

      const queue = rows.map(row => {
        const player = new Players(row.id_player, row.pseudo, row.created_at);
        return new Queue(row.id, row.id_player, row.ip, row.port, row.date_entry, row.priority);  // Pass the playerId instead of the player object
      });

      res.status(200).send({ queue });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la récupération de la file d\'attente', error });
    }
  }

  /**
   * Mettre à jour les informations d'une file d'attente
   */
  static async updateQueue(req: Request, res: Response): Promise<void> {
    const { queueId } = req.params;
    const { ip, port, priority } = req.body;

    if (!ip || !port || !priority) {
      res.status(400).send({ message: 'Les champs IP, port et priorité sont requis.' });
      return;
    }

    try {
      await promisePool.query(
        'UPDATE queue SET ip = ?, port = ?, priority = ? WHERE id = ?',
        [ip, port, priority, queueId]
      );

      res.status(200).send({ message: 'File d\'attente mise à jour avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la mise à jour de la file d\'attente', error });
    }
  }

  /**
   * Retirer un joueur de la file d'attente
   */
  static async removeFromQueue(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      const [existingQueue] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM queue WHERE id_player = ?', [playerId]
      );

      if (existingQueue.length === 0) {
        res.status(404).send({ message: 'Le joueur n\'est pas dans la file d\'attente.' });
        return;
      }

      await promisePool.query('DELETE FROM queue WHERE id_player = ?', [playerId]);

      res.status(200).send({ message: 'Joueur retiré de la file d\'attente.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors du retrait du joueur de la file d\'attente', error });
    }
  }

  /**
   * Vider complètement la file d'attente
   */
  static async clearQueue(req: Request, res: Response): Promise<void> {
    try {
      await promisePool.query('DELETE FROM queue');
      res.status(200).send({ message: 'File d\'attente complètement vidée.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors du nettoyage de la file d\'attente', error });
    }
  }
}
