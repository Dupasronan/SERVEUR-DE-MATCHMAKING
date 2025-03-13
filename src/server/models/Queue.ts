import { Players } from "./Players";
import { RowDataPacket } from "mysql2";

export class Queue {
  id: number;                  // ID de la queue
  id_player: number;            // ID du joueur associé (clé étrangère)
  ip: string;                   // IP du joueur
  port: number;                 // Port du joueur
  date_entry: Date;             // Date d'entrée dans la queue
  priority: number;             // Priorité du joueur dans la queue
  player?: Players;             // Instance optionnelle de Players (chargée si nécessaire)

  constructor(
    id: number,
    id_player: number,
    ip: string,
    port: number,
    date_entry: Date = new Date(),
    priority: number
  ) {
    this.id = id;
    this.id_player = id_player;
    this.ip = ip;
    this.port = port;
    this.date_entry = date_entry;
    this.priority = priority;
  }

  /**
   * Convertir les données de MariaDB en instance Queue
   */
  static fromDB(data: RowDataPacket): Queue {
    return new Queue(
      data.id,
      data.id_player,
      data.ip,
      data.port,
      new Date(data.date_entry),  // Conversion correcte de la date
      data.priority
    );
  }

  /**
   * Vérifier si un joueur est déjà dans la file d'attente
   */
  static isPlayerInQueue(queue: Queue[], playerId: number): boolean {
    return queue.some(entry => entry.id_player === playerId);
  }

  /**
   * Retirer un joueur de la file d'attente
   */
  static removeFromQueue(queue: Queue[], playerId: number): Queue[] {
    return queue.filter(entry => entry.id_player !== playerId);
  }

  /**
   * Récupérer le premier joueur en attente par priorité
   */
  static getFirstInQueue(queue: Queue[]): Queue | null {
    return queue.length > 0 ? queue.sort((a, b) => a.priority - b.priority)[0] : null;
  }

  /**
   * Vider toute la file d’attente
   */
  static clearQueue(): Queue[] {
    return [];
  }

  /**
   * Associer une instance de Players à la file d'attente
   */
  attachPlayer(player: Players): void {
    this.player = player;
  }

  /**
   * Préparer les données pour l'insertion dans MariaDB
   */
  toDB(): Record<string, any> {
    return {
      id_player: this.id_player,
      ip: this.ip,
      port: this.port,
      date_entry: this.date_entry.toISOString().slice(0, 19).replace('T', ' '),
      priority: this.priority,
    };
  }
}



