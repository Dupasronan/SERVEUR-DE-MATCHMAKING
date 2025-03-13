import { Router } from 'express';
import { MatchmakingController } from '../controllers/matchmakingController';

const router = Router();

// Route pour créer un match entre deux joueurs
router.post('/create', MatchmakingController.createMatch);

// Route pour démarrer un match
router.put('/start/:matchId', MatchmakingController.startMatch);

// Route pour mettre à jour le match après un mouvement
router.put('/update', MatchmakingController.updateMatch);

// Route pour supprimer un match
router.delete('/delete/:matchId', MatchmakingController.deleteMatch);

export default router;
