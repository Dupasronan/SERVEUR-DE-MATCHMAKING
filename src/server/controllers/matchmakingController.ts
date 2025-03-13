import { Request, Response } from 'express';
import { promisePool } from '../../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Fonction pour vérifier si un joueur a gagné
function checkWin(gameBoard: string[], playerMark: string): boolean {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // lignes verticales
    [0, 4, 8], [2, 4, 6], // diagonales
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => gameBoard[index] === playerMark)
  );
}

export class MatchmakingController {
  // Créer un match entre deux joueurs
  static async createMatch(req: Request, res: Response): Promise<void> {
    const { player1Id, player2Id } = req.body;

    if (!player1Id || !player2Id) {
      res.status(400).send({ message: 'Les identifiants des joueurs sont requis.' });
      return;
    }

    try {
      const [queuePlayers] = await promisePool.query<RowDataPacket[]>(
        'SELECT id_player FROM queue WHERE id_player IN (?, ?)', 
        [player1Id, player2Id]
      );

      if (queuePlayers.length < 2) {
        const missingPlayers = [player1Id, player2Id].filter(id => !queuePlayers.some(player => player.id_player === id));
        res.status(400).send({ message: `Les joueurs suivants ne sont pas dans la file d'attente: ${missingPlayers.join(', ')}` });
        return;
      }

      const [result] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO matchs (id_player1, id_player2, game_board, status) VALUES (?, ?, ?, ?)',
        [player1Id, player2Id, '---------', 'pending']
      );

      res.status(201).send({ message: 'Match créé avec succès.', matchId: result.insertId });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la création du match.' });
    }
  }

  // Lancer un match
  static async startMatch(req: Request, res: Response): Promise<void> {
    const { matchId } = req.params;

    if (!matchId) {
      res.status(400).send({ message: 'L\'identifiant du match est requis.' });
      return;
    }

    try {
      const [match] = await promisePool.query<RowDataPacket[]>('SELECT status FROM matchs WHERE id_match = ?', [matchId]);

      if (!match.length) {
        res.status(404).send({ message: 'Match non trouvé.' });
        return;
      }

      if (match[0].status !== 'pending') {
        res.status(400).send({ message: 'Le match ne peut pas être lancé, il n\'est pas dans l\'état "en attente".' });
        return;
      }

      await promisePool.query('UPDATE matchs SET status = ? WHERE id_match = ?', ['in_progress', matchId]); // Changer 'started' en 'in_progress'
      res.status(200).send({ message: 'Match lancé avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors du lancement du match.' });
    }
  }

  // Mettre à jour le match après un mouvement
  static async updateMatch(req: Request, res: Response): Promise<void> {
    const { matchId, playerId, position } = req.body;
    const playerMark = playerId === 'player1' ? 'X' : 'O';

    if (!matchId || !playerId || position === undefined) {
      res.status(400).send({ message: 'Les identifiants du match et du joueur ainsi que la position sont requis.' });
      return;
    }

    try {
      const [match] = await promisePool.query<RowDataPacket[]>('SELECT game_board, status FROM matchs WHERE id_match = ?', [matchId]);

      if (!match.length) {
        res.status(404).send({ message: 'Match non trouvé.' });
        return;
      }

      if (match[0].status !== 'in_progress') { // Vérifier que le match est en cours
        res.status(400).send({ message: 'Le match n\'est pas en cours.' });
        return;
      }

      const gameBoard = match[0].game_board.split('');

      if (gameBoard[position] !== '-') {
        res.status(400).send({ message: 'La case est déjà occupée.' });
        return;
      }

      gameBoard[position] = playerMark;

      if (checkWin(gameBoard, playerMark)) {
        await promisePool.query(
          'UPDATE matchs SET game_board = ?, status = ?, id_winner = ? WHERE id_match = ?',
          [gameBoard.join(''), 'finished', playerId, matchId] 
        );
        res.status(200).send({ message: 'Le joueur a gagné.', gameBoard: gameBoard.join('') });
      } else {
        await promisePool.query(
          'UPDATE matchs SET game_board = ? WHERE id_match = ?',
          [gameBoard.join(''), matchId]
        );
        res.status(200).send({ message: 'Le mouvement a été effectué.', gameBoard: gameBoard.join('') });
      }
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la mise à jour du match.' });
    }
  }

  // Supprimer un match
  static async deleteMatch(req: Request, res: Response): Promise<void> {
    const { matchId } = req.params;

    if (!matchId) {
      res.status(400).send({ message: 'L\'identifiant du match est requis.' });
      return;
    }

    try {
      await promisePool.query('DELETE FROM matchs WHERE id_match = ?', [matchId]);
      res.status(200).send({ message: 'Match supprimé avec succès.' });
    } catch (error) {
      console.error("Erreur MariaDB :", error);
      res.status(500).send({ message: 'Erreur lors de la suppression du match.' });
    }
  }
}
