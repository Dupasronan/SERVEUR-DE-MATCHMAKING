import express from 'express';
import TurnController from '../controllers/turnController';

const router = express.Router();

// Créer un tour
// Enregistrer un tour
// Récupérer tous les tours
// Récupérer les tours par match
// Récupérer les tours par joueur
 // Supprimer un tour
 // Supprimer tous les tours d'un match
router.post('/turn', TurnController.createTurn);
router.post('/record-turn', TurnController.recordTurn);  
router.get('/turns', TurnController.getAllTurns);  
router.get('/turns/match/:id_match', TurnController.getTurnsByMatch);
router.get('/turns/player/:id_player', TurnController.getTurnsByPlayer);
router.delete('/turn/:id_match/:id_player', TurnController.deleteTurnByMatch);
router.delete('/turns/match/:id_match', TurnController.deleteTurnsByMatch); 
export default router;








