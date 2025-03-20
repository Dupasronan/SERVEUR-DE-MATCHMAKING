import { Request, Response } from "express";
import { Queue } from "../models/Queue";
import { Players } from "../models/Players";

export class QueueController {
  // Ajouter un joueur à la file d'attente
  static async addPlayerToQueue(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    const { priority } = req.body;

    const ip: string = req.ip ?? "0.0.0.0";
    const port: number = req.socket.remotePort ?? 0;

    if (!priority) {
      res.status(400).send({ message: "La priorité est requise." });
      return;
    }

    try {
      const newEntry = await Queue.createQueueEntry(
        Number(playerId),
        ip,
        port,
        new Date(),
        priority
      );

      if (!newEntry) {
        res.status(500).send({ message: "Erreur lors de l'ajout du joueur à la file d'attente." });
        return;
      }

      res.status(201).send({ message: "Joueur ajouté à la file d'attente." });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }

  // Récupérer tous les joueurs dans la file d'attente
  static async getPlayersInQueue(req: Request, res: Response): Promise<void> {
    try {
      const queue = await Queue.getAllQueueEntries();
      res.status(200).send({ queue });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }

  // Modifier le joueur d'une entrée
  static async updateQueueEntryPlayer(req: Request, res: Response): Promise<void> {
    const { id, playerId } = req.params;

    try {
      const success = await Queue.updateQueueEntryPlayer(Number(id), Number(playerId));

      if (!success) {
        res.status(404).send({ message: "Entrée introuvable ou mise à jour échouée." });
        return;
      }

      res.status(200).send({ message: "Joueur mis à jour dans la file d'attente." });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }

  // Modifier IP et Port d'une entrée
  static async updateQueue(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { ip, port } = req.body;

    if (!ip || !port) {
      res.status(400).send({ message: "IP et Port sont requis." });
      return;
    }

    try {
      const success = await Queue.updateQueue(Number(id), ip, Number(port));

      if (!success) {
        res.status(404).send({ message: "Entrée introuvable ou mise à jour échouée." });
        return;
      }

      res.status(200).send({ message: "Entrée mise à jour avec succès." });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }

  // Modifier la priorité d'une entrée
  static async updateQueueEntryPriority(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { priority } = req.body;

    if (priority === undefined) {
      res.status(400).send({ message: "La priorité est requise." });
      return;
    }

    try {
      const success = await Queue.updateQueueEntryPriority(Number(id), Number(priority));

      if (!success) {
        res.status(404).send({ message: "Entrée introuvable ou mise à jour échouée." });
        return;
      }

      res.status(200).send({ message: "Priorité mise à jour avec succès." });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }

  // Supprimer une entrée de la file d'attente par ID
  static async removeQueueEntryById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const success = await Queue.removeQueueEntryById(Number(id));

      if (!success) {
        res.status(404).send({ message: "Entrée non trouvée." });
        return;
      }

      res.status(200).send({ message: "Entrée supprimée de la file d'attente." });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }

  // Supprimer une entrée de la file d'attente par ID joueur
  static async removeFromQueue(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;

    try {
      const success = await Queue.removeQueueEntryByPlayerId(Number(playerId));

      if (!success) {
        res.status(404).send({ message: "Le joueur n'est pas dans la file d'attente." });
        return;
      }

      res.status(200).send({ message: "Joueur retiré de la file d'attente." });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }

  // Vider complètement la file d'attente
  static async clearQueue(req: Request, res: Response): Promise<void> {
    try {
      await Queue.clearQueue();
      res.status(200).send({ message: "File d'attente vidée." });
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).send({ message: "Erreur serveur" });
    }
  }
}

