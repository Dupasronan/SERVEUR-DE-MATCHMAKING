import { Router } from 'express';
import { 
    createTurn, 
    getAllTurns, 
    getTurnsByMatch,
    getTurnByPlayer, 
    pauseTurn, 
    resumeTurn, 
    replayTurn, 
    endTurn, 
    updateTurn, 
    deleteTurn, 
    deleteTurnByPlayer,
    deleteTurnsByMatch,
    deleteTurns,
    quitTurn,
    startTurn
} from '../controllers/turnController';

const router = Router();

// Définition des routes
router.post('/', createTurn); // Créer un tour
router.get('/', getAllTurns); // Récupérer tous les tours
router.get('/:id_match', getTurnsByMatch); // Récupérer les tours par match
router.get('/player/:id_player', getTurnByPlayer); // Récupérer les tours par joueur

router.put('/pause/:id_turn', pauseTurn); // Mettre un tour en pause
router.put('/resume/:id_turn', resumeTurn); // Reprendre un tour en pause
router.put('/replay/:id_turn', replayTurn); // Rejouer un tour
router.put('/end/:id_turn', endTurn); // Finir un tour
router.put('/:id_turn', updateTurn); // Mettre à jour un tour spécifique
router.put('/start/:id_match', startTurn); // Démarrer un tour pour un match

router.delete('/player/:id_player', deleteTurnByPlayer); // Supprimer un tour par joueur
router.delete('/match/:id_match', deleteTurnsByMatch); // Supprimer les tours par match
router.delete('/', deleteTurns); // Supprimer tous les tours
router.delete('/turn/:id_turn', deleteTurn); // Supprimer un tour spécifique
router.delete('/quit/:id_player/:id_match', quitTurn); // Quitter un tour pour un joueur et un match

export default router;




