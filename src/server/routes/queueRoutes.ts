import express from 'express';
import { QueueController } from '../controllers/queueController';

const router = express.Router();

// Ajouter un joueur à la file d'attente
router.post('/queue/:playerId', QueueController.addPlayerToQueue);

// Récupérer tous les joueurs dans la file d'attente
router.get('/queue', QueueController.getPlayersInQueue);

// Mettre à jour les informations d'une file d'attente
router.put('/queue/:queueId', QueueController.updateQueue);

// Retirer un joueur de la file d'attente
router.delete('/queue/:playerId', QueueController.removeFromQueue);

// Vider la file d'attente complètement
router.delete('/queue', QueueController.clearQueue);

export default router;
