import { User } from "./User";
import { Match } from "./Match";

export class Turn {
    id: number;
    match: Match;
    player: User;
    column: number;
    createdAt: Date;

    constructor(id: number, match: Match, player: User, column: number) {
        this.id = id;
        this.match = match;
        this.player = player;
        this.column = column;
        this.createdAt = new Date();
    }

    // Exécuter le tour (placer un jeton)
    play(): boolean {
        const success = this.match.dropPiece(this.column, this.player);
        if (success) {
            this.match.updateStatus();
        }
        return success;
    }
}
