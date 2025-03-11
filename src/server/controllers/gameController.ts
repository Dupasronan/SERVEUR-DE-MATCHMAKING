import { Request, Response } from 'express';
import { promisePool } from '../../database/connection';
import { RowDataPacket } from 'mysql2';

export class GameController {
  // Démarrer un match
  static async startGame(req: Request, res: Response): Promise<void> {
    const { matchId } = req.body;

    if (!matchId) {
      res.status(400).send({ message: 'L\'identifiant du match est requis.' });
      return;
    }

    try {
      const [match] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM matchs WHERE id_match = ? AND status = ? LIMIT 1',
        [matchId, 'pending']
      );

      if (!match.length) {
        res.status(400).send({ message: 'Le match n\'existe pas ou a déjà commencé.' });
        return;
      }

      await promisePool.query(
        'UPDATE matchs SET status = ?, current_turn = ? WHERE id_match = ?',
        ['in_progress', 1, matchId]
      );

      res.status(200).send({ message: 'Match démarré avec succès.' });
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors du démarrage du match', error });
    }
  }

  // Mettre un match en pause
  static async pauseGame(req: Request, res: Response): Promise<void> {
    const { matchId } = req.body;

    try {
      const [match] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM matchs WHERE id_match = ? AND status = ? LIMIT 1',
        [matchId, 'in_progress']
      );

      if (!match.length) {
        res.status(400).send({ message: 'Le match n\'est pas en cours.' });
        return;
      }

      await promisePool.query(
        'UPDATE matchs SET status = ? WHERE id_match = ?',
        ['paused', matchId]
      );

      res.status(200).send({ message: 'Match mis en pause.' });
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la mise en pause du match.', error });
    }
  }

  // Relancer un match
  static async resumeGame(req: Request, res: Response): Promise<void> {
    const { matchId } = req.body;

    try {
      const [match] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM matchs WHERE id_match = ? AND status = ? LIMIT 1',
        [matchId, 'paused']
      );

      if (!match.length) {
        res.status(400).send({ message: 'Le match n\'est pas en pause.' });
        return;
      }

      await promisePool.query(
        'UPDATE matchs SET status = ? WHERE id_match = ?',
        ['in_progress', matchId]
      );

      res.status(200).send({ message: 'Match relancé.' });
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la relance du match.', error });
    }
  }

  // Terminer un match
  static async endGame(req: Request, res: Response): Promise<void> {
    const { matchId, winnerId } = req.body;

    if (!matchId || !winnerId) {
      res.status(400).send({ message: 'Les identifiants du match et du gagnant sont requis.' });
      return;
    }

    try {
      const [match] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM matchs WHERE id_match = ? AND status = ? LIMIT 1',
        [matchId, 'in_progress']
      );

      if (!match.length) {
        res.status(400).send({ message: 'Le match n\'existe pas ou n\'est pas en cours.' });
        return;
      }

      await promisePool.query(
        'UPDATE matchs SET status = ?, id_winner = ? WHERE id_match = ?',
        ['finished', winnerId, matchId]
      );

      res.status(200).send({ message: 'Match terminé avec succès.' });
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la fin du match.', error });
    }
  }
}
