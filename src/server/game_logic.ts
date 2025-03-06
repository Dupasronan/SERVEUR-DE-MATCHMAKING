import { Matchs } from './models/Matchs';
import { Turns } from './models/Turns';
import { Players } from './models/Players';

export class GameLogic {
  static startNewMatch(player1: Players, player2: Players): Matchs {
    const newMatch = new Matchs(0, player1, player2, "---------", "pending", null, new Date());
    // Ajouter le match à la base de données ou au stockage
    return newMatch;
  }

  static playTurn(match: Matchs, player: Players, position: number): boolean {
    if (Turns.isValidMove(match, position)) {
      const turn = new Turns(0, match, player, position, new Date());
      Turns.applyMove(match, turn);

      // Vérifier si un joueur a gagné
      if (Turns.checkWinner(match)) {
        match.declareWinner(player);
      }
      return true;
    }
    return false;
  }
}
