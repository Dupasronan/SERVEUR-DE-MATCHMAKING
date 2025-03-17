import { Router } from 'express';
import { QueueController } from '../controllers/queueController';

const router = Router();

// Ajouter un joueur à la file d'attente
router.post('/queue/:playerId', QueueController.addPlayerToQueue);

// Récupérer tous les joueurs dans la file d'attente
router.get('/queue', QueueController.getPlayersInQueue);

// Mettre à jour une entrée de la file d'attente
router.put('/queue/:queueId', QueueController.updateQueue);

// Retirer un joueur de la file d'attente
router.delete('/queue/:playerId', QueueController.removeFromQueue);

// Vider complètement la file d'attente
router.delete('/queue', QueueController.clearQueue);

export default router;
