import { Router } from 'express';
import { PlayerController } from '../controllers/playerController';

const router = Router();

// Route pour inscrire un nouveau joueur
router.post('/players', PlayerController.registerPlayer);

// Route pour récupérer tous les joueurs
router.get('/players', PlayerController.getPlayers);

// Route pour récupérer un joueur par ID
router.get('/players/:playerId', PlayerController.getPlayer);

// Route pour mettre à jour un joueur par ID
router.put('/players/:playerId', PlayerController.updatePlayer);

// Route pour supprimer un joueur par ID
router.delete('/players/:playerId', PlayerController.deletePlayer);

// Route pour récupérer un joueur par pseudo
router.get('/players/pseudo/:pseudo', PlayerController.getPlayerByPseudo);

// Route pour mettre à jour un joueur par pseudo
router.put('/players/pseudo/:pseudo', PlayerController.updatePlayerByPseudo);

export default router;


