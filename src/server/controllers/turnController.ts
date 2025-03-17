import { Request, Response } from 'express';
import { promisePool } from '../../database/connection';
import Turns from '../models/Turns';

// Création d'un tour
export const createTurn = async (req: Request, res: Response) => {
  const { id_match, id_player, position_played, played_at } = req.body;
  
  try {
    const [result] = await promisePool.execute(
      'INSERT INTO turns (id_match, id_player, position_played, played_at) VALUES (?, ?, ?, ?)',
      [id_match, id_player, position_played, played_at]
    );
    res.status(201).json({ message: 'Turn created', result });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Récupérer tous les tours
export const getAllTurns = async (_req: Request, res: Response) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM turns');
    const turns = (rows as any[]).map(Turns.fromDB);
    res.status(200).json(turns);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupérer les tours par match
export const getTurnsByMatch = async (req: Request, res: Response) => {
  const { id_match } = req.params;
  try {
    const [rows] = await promisePool.query('SELECT * FROM turns WHERE id_match = ?', [id_match]);
    const turns = (rows as any[]).map(Turns.fromDB);
    res.status(200).json(turns);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupérer les tours par joueur
export const getTurnByPlayer = async (req: Request, res: Response) => {
  const { id_player } = req.params;
  try {
    const [rows] = await promisePool.query('SELECT * FROM turns WHERE id_player =?', [id_player]);
    const turns = (rows as any[]).map(Turns.fromDB);
    res.status(200).json(turns);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Jouer les tours de manière ascendante
export const playTurns = async (req: Request, res: Response) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM turns ORDER BY id_match ASC, position_played ASC');
    const turns = (rows as any[]).map(Turns.fromDB);
    res.status(200).json(turns);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Supprimer un tour par joueur
export const deleteTurnByPlayer = async (req: Request, res: Response) => {
  const { id_player } = req.params;
  try {
    await promisePool.execute('DELETE FROM turns WHERE id_player =?', [id_player]);
    res.status(200).json({ message: 'Turn(s) deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Supprimer les tours par match
export const deleteTurnsByMatch = async (req: Request, res: Response) => {
  const { id_match } = req.params;
  try {
    await promisePool.execute('DELETE FROM turns WHERE id_match =?', [id_match]);
    res.status(200).json({ message: 'Turn(s) deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Supprimer tous les tours
export const deleteTurns = async (_req: Request, res: Response) => {
  try {
    await promisePool.execute('DELETE FROM turns');
    res.status(200).json({ message: 'All turns deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Quitter un tour d'un match
export const quitTurn = async (req: Request, res: Response) => {
  const { id_player, id_match } = req.params;
  try {
    await promisePool.execute('DELETE FROM turns WHERE id_player =? AND id_match =?', [id_player, id_match]);
    res.status(200).json({ message: 'Turn quitted' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Démarrer un tour
export const startTurn = async (req: Request, res: Response) => {
  const { id_match } = req.params;
  try {
    const [result] = await promisePool.execute(
      'INSERT INTO turns (id_match, id_player, position_played) VALUES (?, (SELECT id_player FROM players WHERE is_ready = 1 AND id_match =? LIMIT 1), 1)',
      [id_match, id_match]
    );
    res.status(201).json({ message: 'Turn started', result });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mettre à jour un tour
export const updateTurn = async (req: Request, res: Response) => {
  const { id_turn } = req.params;
  const { position_played } = req.body;
  try {
    await promisePool.execute('UPDATE turns SET position_played = ? WHERE id_turn = ?', [position_played, id_turn]);
    res.status(200).json({ message: 'Turn updated' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Fonctionnalités non implémentées
export const pauseTurn = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Turn paused (functionality to be implemented)' });
};

export const resumeTurn = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Turn resumed (functionality to be implemented)' });
};

export const replayTurn = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Turn replayed (functionality to be implemented)' });
};

export const endTurn = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Turn ended (functionality to be implemented)' });
};

// Supprimer un tour spécifique
export const deleteTurn = async (req: Request, res: Response) => {
  const { id_turn } = req.params;
  try {
    await promisePool.execute('DELETE FROM turns WHERE id_turn = ?', [id_turn]);
    res.status(200).json({ message: 'Turn deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
};




