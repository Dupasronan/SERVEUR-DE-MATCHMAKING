import { Router } from 'express';
import { PlayerController } from '../controllers/playerController';  // Importation du PlayerController

// Création de la route principale pour les joueurs
const router: Router = Router();

// Route pour enregistrer un nouveau joueur
router.post('/register', PlayerController.registerPlayer);

// Route pour récupérer tous les joueurs
router.get('/', PlayerController.getPlayers);

// Route pour récupérer un joueur par son ID
router.get('/:playerId', PlayerController.getPlayer);

// Route pour mettre à jour un joueur par son ID
router.put('/:playerId', PlayerController.updatePlayer);

// Route pour supprimer un joueur par son ID
router.delete('/:playerId', PlayerController.deletePlayer);

// Route pour récupérer un joueur par son pseudo
router.get('/pseudo/:pseudo', PlayerController.getPlayerByPseudo);

// Route pour mettre à jour un joueur par son pseudo
router.put('/pseudo/:pseudo', PlayerController.updatePlayerByPseudo);

export default router;



