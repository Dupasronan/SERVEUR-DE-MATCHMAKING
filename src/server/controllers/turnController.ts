import { Request, Response } from 'express';
import Turns from '../models/Turns'; // Assurez-vous que le chemin du fichier est correct

class TurnController {

  // Créer un tour
  static async createTurn(req: Request, res: Response): Promise<void> {
    const { id_match, id_player, position_played } = req.body;

    if (!id_match || !id_player || position_played === undefined) {
      res.status(400).json({ message: 'Tous les champs sont nécessaires' });
      return;
    }

    try {
      await Turns.createTurn(id_match, id_player, position_played);
      res.status(201).json({ message: 'Tour créé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du tour', error });
    }
  }

  // Enregistrer un tour
  static async recordTurn(req: Request, res: Response): Promise<void> {
    const { id_match, id_player, position_played } = req.body;

    if (!id_match || !id_player || position_played === undefined) {
      res.status(400).json({ message: 'Tous les champs sont nécessaires' });
      return;
    }

    try {
      await Turns.recordTurn(id_match, id_player, position_played);
      res.status(201).json({ message: 'Tour enregistré avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement du tour', error });
    }
  }

  // Récupérer tous les tours
  static async getAllTurns(req: Request, res: Response): Promise<void> {
    try {
      const turns = await Turns.getAllTurns();
      res.status(200).json(turns);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tours', error });
    }
  }

  // Récupérer les tours par match
  static async getTurnsByMatch(req: Request, res: Response): Promise<void> {
    const { id_match } = req.params;

    if (!id_match) {
      res.status(400).json({ message: 'L\'ID du match est nécessaire' });
      return;
    }

    try {
      const turns = await Turns.getTurnsByMatch(Number(id_match));
      res.status(200).json(turns);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tours par match', error });
    }
  }

  // Récupérer les tours par joueur
  static async getTurnsByPlayer(req: Request, res: Response): Promise<void> {
    const { id_player } = req.params;

    if (!id_player) {
      res.status(400).json({ message: 'L\'ID du joueur est nécessaire' });
      return;
    }

    try {
      const turns = await Turns.getTurnsByPlayer(Number(id_player));
      res.status(200).json(turns);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tours par joueur', error });
    }
  }

  // Supprimer un tour spécifique pour un match
  static async deleteTurnByMatch(req: Request, res: Response): Promise<void> {
    const { id_match, id_player } = req.params;

    if (!id_match || !id_player) {
      res.status(400).json({ message: 'L\'ID du match et du joueur sont nécessaires' });
      return;
    }

    try {
      await Turns.deleteTurnByMatch(Number(id_match), Number(id_player));
      res.status(200).json({ message: 'Tour supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du tour', error });
    }
  }

  // Supprimer tous les tours d'un match
  static async deleteTurnsByMatch(req: Request, res: Response): Promise<void> {
    const { id_match } = req.params;

    if (!id_match) {
      res.status(400).json({ message: 'L\'ID du match est nécessaire' });
      return;
    }

    try {
      await Turns.deleteTurnsByMatch(Number(id_match));
      res.status(200).json({ message: 'Tous les tours du match ont été supprimés avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression des tours', error });
    }
  }

  // Mettre à jour un tour
  static async updateTurn(req: Request, res: Response): Promise<void> {
    const { id_turn, position_played } = req.body;

    if (!id_turn || position_played === undefined) {
      res.status(400).json({ message: 'L\'ID du tour et la position sont nécessaires' });
      return;
    }

    try {
      await Turns.updateTurn(id_turn, position_played);
      res.status(200).json({ message: 'Tour mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du tour', error });
    }
  }

  // Récupérer le prochain tour pour un match
  static async getNextTurn(req: Request, res: Response): Promise<void> {
    const { id_match } = req.params;

    if (!id_match) {
      res.status(400).json({ message: 'L\'ID du match est nécessaire' });
      return;
    }

    try {
      const turn = await Turns.getNextTurn(Number(id_match));
      res.status(200).json(turn || { message: 'Aucun prochain tour disponible pour ce match' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du prochain tour', error });
    }
  }

  // Récupérer le dernier tour joué pour un joueur
  static async getLastTurnByPlayer(req: Request, res: Response): Promise<void> {
    const { id_player } = req.params;

    if (!id_player) {
      res.status(400).json({ message: 'L\'ID du joueur est nécessaire' });
      return;
    }

    try {
      const turn = await Turns.getLastTurnByPlayer(Number(id_player));
      res.status(200).json(turn || { message: 'Aucun dernier tour disponible pour ce joueur' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du dernier tour', error });
    }
  }

  // Récupérer le dernier tour joué pour un match
  static async getLastTurnByMatch(req: Request, res: Response): Promise<void> {
    const { id_match } = req.params;

    if (!id_match) {
      res.status(400).json({ message: 'L\'ID du match est nécessaire' });
      return;
    }

    try {
      const turn = await Turns.getLastTurnByMatch(Number(id_match));
      res.status(200).json(turn || { message: 'Aucun dernier tour disponible pour ce match' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du dernier tour', error });
    }
  }
}

export default TurnController;








