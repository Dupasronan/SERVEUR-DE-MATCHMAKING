import { Request, Response } from 'express';
import { Players } from '../models/Players';

export class PlayerController {

  static async registerPlayer(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.body;

    if (!pseudo || pseudo.trim().length === 0) {
      res.status(400).json({ message: 'Le pseudo est requis et ne peut pas être vide.' });
      return;
    }

    try {
      const existingPlayer = await Players.getByPseudo(pseudo);
      if (existingPlayer) {
        res.status(409).json({ message: 'Ce pseudo est déjà pris.' });
        return;
      }

      const newPlayerId = await Players.create(pseudo);
      if (newPlayerId) {
        res.status(201).json({ message: 'Joueur inscrit avec succès.', id_player: newPlayerId });
      } else {
        res.status(500).json({ message: 'Erreur lors de la création du joueur.' });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  static async getPlayers(_: Request, res: Response): Promise<void> {
    try {
      const players = await Players.getAllPlayers();
      res.status(200).json({ players });
    } catch (error) {
      console.error("Erreur lors de la récupération des joueurs:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  static async getPlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    try {
      const player = await Players.getById(Number(playerId));
      if (!player) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }
      res.status(200).json({ player });
    } catch (error) {
      console.error("Erreur lors de la récupération du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  static async updatePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    const { pseudo } = req.body;

    if (!pseudo || pseudo.trim().length === 0) {
      res.status(400).json({ message: 'Le pseudo est requis et ne peut pas être vide.' });
      return;
    }

    try {
      const success = await Players.updatePlayer(Number(playerId), pseudo);
      if (!success) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }
      res.status(200).json({ message: 'Pseudo mis à jour avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  static async deletePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    try {
      const success = await Players.deletePlayer(Number(playerId));
      if (!success) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }
      res.status(200).json({ message: 'Joueur supprimé avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la suppression du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }
  
  static async getPlayerByPseudo(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.params;

    if (!pseudo || pseudo.trim().length === 0) {
      res.status(400).json({ message: 'Le pseudo est requis et ne peut pas être vide.' });
      return;
    }

    try {
      const player = await Players.getByPseudo(pseudo);
      if (!player) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }
      res.status(200).json({ player });
    } catch (error) {
      console.error("Erreur lors de la récupération du joueur par pseudo:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }
  
  static async updatePlayerByPseudo(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.params;
    const { newPseudo } = req.body;

    if (!pseudo || pseudo.trim().length === 0 ||!newPseudo || newPseudo.trim().length === 0) {
      res.status(400).json({ message: 'Les pseudos sont requis et ne peuvent pas être vides.' });
      return;
    }
  } 
}


