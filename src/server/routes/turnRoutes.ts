import express from 'express';
import TurnController from '../controllers/turnController';

const router = express.Router();

router.post('/turn', TurnController.createTurn);  // Créer un tour
router.post('/record-turn', TurnController.recordTurn);  // Enregistrer un tour
router.get('/turns', TurnController.getAllTurns);  // Récupérer tous les tours
router.get('/turns/match/:id_match', TurnController.getTurnsByMatch);  // Récupérer les tours par match
router.get('/turns/player/:id_player', TurnController.getTurnsByPlayer);  // Récupérer les tours par joueur
router.delete('/turn/:id_match/:id_player', TurnController.deleteTurnByMatch);  // Supprimer un tour
router.delete('/turns/match/:id_match', TurnController.deleteTurnsByMatch);  // Supprimer tous les tours d'un match

export default router;








