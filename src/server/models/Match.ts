import { User } from "./User";

export class Match {
    id: number;
    player1: User;
    player2: User;
    board: string[][]; // Grille de jeu (6x7)
    status: "waiting" | "in_progress" | "finished";
    winner: User | null;
    createdAt: Date;

    constructor(id: number, player1: User, player2: User) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.status = "waiting";
        this.winner = null;
        this.createdAt = new Date();

        // Initialiser un plateau vide (6 lignes x 7 colonnes)
        this.board = Array.from({ length: 6 }, () => Array(7).fill(null));
    }

    // Ajouter un jeton dans une colonne
    dropPiece(column: number, player: User): boolean {
        if (column < 0 || column >= 7) return false;

        for (let row = 5; row >= 0; row--) {
            if (!this.board[row][column]) {
                this.board[row][column] = player.username;
                return true;
            }
        }
        return false;
    }

    // Vérifier si un joueur a gagné
    checkWinner(): User | null {
        // Vérification des alignements horizontaux, verticaux et diagonaux
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const player = this.board[row][col];
                if (!player) continue;

                for (const [dx, dy] of directions) {
                    let count = 1;
                    for (let i = 1; i < 4; i++) {
                        const newRow = row + i * dx;
                        const newCol = col + i * dy;
                        if (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 7 || this.board[newRow][newCol] !== player) {
                            break;
                        }
                        count++;
                    }
                    if (count === 4) {
                        return player === this.player1.username ? this.player1 : this.player2;
                    }
                }
            }
        }
        return null;
    }

    // Mettre à jour l'état du match
    updateStatus(): void {
        const winner = this.checkWinner();
        if (winner) {
            this.status = "finished";
            this.winner = winner;
        } else if (this.board.flat().every(cell => cell !== null)) {
            this.status = "finished"; // Match nul
        } else {
            this.status = "in_progress";
        }
    }
}
