import { Router } from "express";
import { QueueController } from "../controllers/queueController";

const router = Router();

// Ajouter un joueur à la file d'attente
router.post("/queue/:playerId", QueueController.addPlayerToQueue);

// Récupérer tous les joueurs dans la file d'attente
router.get("/queue", QueueController.getPlayersInQueue);

// Mettre à jour une entrée (changement d'IP et port)
router.put("/queue/:id", QueueController.updateQueue);

// Modifier uniquement le joueur d'une entrée
router.put("/queue/:id/player/:playerId", QueueController.updateQueueEntryPlayer);

// Modifier la priorité d'une entrée
router.put("/queue/:id/priority", QueueController.updateQueueEntryPriority);

// Retirer un joueur de la file d'attente par ID du joueur
router.delete("/queue/player/:playerId", QueueController.removeFromQueue);

// Supprimer une entrée de la file d'attente par ID de l’entrée
router.delete("/queue/:id", QueueController.removeQueueEntryById);

// Vider complètement la file d'attente
router.delete("/queue", QueueController.clearQueue);

export default router;

