import { Request, Response } from 'express';
import { Players } from '../models/Players';

export class PlayerController {
  // Inscription d'un joueur
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

      const newPlayer = await Players.addNewPlayer(pseudo);
      res.status(201).json({ message: 'Joueur inscrit avec succès.', player: newPlayer.toJSON() });
    } catch (error) {
      console.error("Erreur lors de l'inscription du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  // Lister tous les joueurs
  static async getPlayers(_: Request, res: Response): Promise<void> {
    try {
      const players = await Players.getAllPlayers();
      res.status(200).json({ players });
    } catch (error) {
      console.error("Erreur lors de la récupération des joueurs:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  // Récupérer un joueur par ID
  static async getPlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      const player = await Players.getById(Number(playerId));
      if (!player) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).json({ player: player.toJSON() });
    } catch (error) {
      console.error("Erreur lors de la récupération du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  // Modifier un joueur par ID
  static async updatePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    const { pseudo } = req.body;

    if (!pseudo || pseudo.trim().length === 0) {
      res.status(400).json({ message: 'Le pseudo est requis et ne peut pas être vide.' });
      return;
    }

    try {
      const player = await Players.getById(Number(playerId));
      if (!player) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }

      player.updatePseudo(pseudo);
      await Players.updatePlayer(player);
      res.status(200).json({ message: 'Pseudo mis à jour avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  // Supprimer un joueur par ID
  static async deletePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      const player = await Players.getById(Number(playerId));
      if (!player) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }

      await Players.deletePlayer(player.id_player);
      res.status(200).json({ message: 'Joueur supprimé avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la suppression du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  // Récupérer un joueur par pseudo
  static async getPlayerByPseudo(req: Request, res: Response): Promise<void> {
    const { pseudo } = req.params;

    try {
      const player = await Players.getByPseudo(pseudo);
      if (!player) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }

      res.status(200).json({ player: player.toJSON() });
    } catch (error) {
      console.error("Erreur lors de la récupération du joueur par pseudo:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }

  // Mettre à jour un joueur par pseudo
  // playerController.ts - méthode updatePlayerByPseudo simplifiée
static async updatePlayerByPseudo(req: Request, res: Response): Promise<void> {
  const { pseudo } = req.params;
  const { newPseudo } = req.body;

  if (!newPseudo) {
    res.status(400).send({ message: "Le nouveau pseudo est requis." });
    return;
  }

  try {
    // Récupérer directement l'instance de Players
    const player = await Players.getByPseudo(pseudo);
    if (!player) {
      res.status(404).send({ message: 'Joueur non trouvé.' });
      return;
    }

    // Vérifier si le nouveau pseudo est identique à l'ancien
    if (player.pseudo === newPseudo) {
      res.status(400).send({ message: 'Le nouveau pseudo est identique à l\'ancien.' });
      return;
    }

    player.updatePseudo(newPseudo); // Mettre à jour l'instance
    await Players.updatePlayer(player); // Sauvegarder en base
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
      const player = await Players.getByPseudo(pseudo);
      if (!player) {
        res.status(404).json({ message: 'Joueur non trouvé.' });
        return;
      }

      await Players.deletePlayer(player.id_player);
      res.status(200).json({ message: 'Joueur supprimé avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la suppression du joueur:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }
}




