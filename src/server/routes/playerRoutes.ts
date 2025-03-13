import { Router } from 'express';
import { PlayerController } from '../controllers/playerController';

const router = Router();

// Route d'inscription
router.post('/register', PlayerController.registerPlayer);             // Inscrire un joueur

// Routes basées sur le pseudo (plus spécifiques)
router.get('/pseudo/:pseudo', PlayerController.getPlayerByPseudo);     // Récupérer un joueur par pseudo
router.put('/pseudo/:pseudo', PlayerController.updatePlayerByPseudo);  // Modifier un joueur par pseudo
router.delete('/pseudo/:pseudo', PlayerController.deletePlayerByPseudo); // Supprimer un joueur par pseudo

// Routes basées sur l'ID (plus génériques)
router.get('/:playerId', PlayerController.getPlayer);                  // Récupérer un joueur par ID
router.put('/:playerId', PlayerController.updatePlayer);               // Modifier un joueur par ID
router.delete('/:playerId', PlayerController.deletePlayer);            // Supprimer un joueur par ID

// Route pour lister tous les joueurs
router.get('/', PlayerController.getPlayers);                          // Lister tous les joueurs

export default router;

