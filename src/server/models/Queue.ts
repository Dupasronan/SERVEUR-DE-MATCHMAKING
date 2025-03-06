import { Players } from "./Players";

export class Queue {
  id: number;
  player: Players;
  ip: string;
  port: number;
  date_entry: Date;

  constructor(id: number, player: Players, ip: string, port: number, date_entry: Date) {
    this.id = id;
    this.player = player;
    this.ip = ip;
    this.port = port;
    this.date_entry = date_entry;
  }

  // Vérifier si un joueur est déjà dans la file d'attente
  static isPlayerInQueue(queue: Queue[], playerId: number): boolean {
    return queue.some(entry => entry.player.id_player === playerId);
  }

  // Retirer un joueur de la file d'attente
  static removeFromQueue(queue: Queue[], playerId: number): Queue[] {
    return queue.filter(entry => entry.player.id_player !== playerId);
  }

  // Récupérer le premier joueur en attente
  static getFirstInQueue(queue: Queue[]): Queue | null {
    return queue.length > 0 ? queue[0] : null;
  }

  // Vider toute la file d’attente
  static clearQueue(): Queue[] {
    return [];
  }
}
