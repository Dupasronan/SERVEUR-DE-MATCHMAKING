export default class Turns {
  id_turn: number;
  id_match: number;
  id_player: number;
  position_played: number;
  played_at: Date;

  constructor(id_turn: number, id_match: number, id_player: number, position_played: number, played_at: Date) {
    this.id_turn = id_turn;
    this.id_match = id_match;
    this.id_player = id_player;
    this.position_played = position_played;
    this.played_at = played_at;
  }

  // Convertir l'instance en format JSON
  toJSON(): object {
    return {
      id_turn: this.id_turn,
      id_match: this.id_match,
      id_player: this.id_player,
      position_played: this.position_played,
      played_at: this.played_at.toISOString(),
    };
  }

  // Convertir une ligne de la base de données en instance de Turns
  static fromDB(row: any): Turns {
    return new Turns(row.id_turn, row.id_match, row.id_player, row.position_played, new Date(row.played_at));
  }
}
