export class Players {
    id_player: number;
    pseudo: string;
    created_at: Date;
  
    constructor(id_player: number, pseudo: string, created_at: Date) {
      this.id_player = id_player;
      this.pseudo = pseudo;
      this.created_at = created_at;
    }
  
    // Afficher les informations du joueur
    displayInfo(): void {
      console.log(`ID: ${this.id_player}, Pseudo: ${this.pseudo}, Créé le: ${this.created_at}`);
    }
  
    // Modifier le pseudo du joueur
    updatePseudo(newPseudo: string): void {
      if (newPseudo.length > 0) {
        this.pseudo = newPseudo;
        console.log(`Pseudo mis à jour : ${this.pseudo}`);
      } else {
        console.log("Le pseudo ne peut pas être vide !");
      }
    }
  
    // Comparer deux joueurs (utile pour identifier un gagnant)
    isEqual(otherPlayer: Players): boolean {
      return this.id_player === otherPlayer.id_player;
    }
  
    // Créer un joueur depuis une base de données
    static fromDB(row: any): Players {
      return new Players(row.id_player, row.pseudo, new Date(row.created_at));
    }
  }
  
  