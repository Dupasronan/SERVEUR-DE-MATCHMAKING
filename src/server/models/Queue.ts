import { promisePool } from "../../database/connection";
import { Players } from "./Players";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class Queue {
  id: number;
  id_player: number;
  ip: string;
  port: number;
  date_entry: Date;
  priority: number;
  player?: Players;

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

  attachPlayer(player: Players): void {
    this.player = player;
  }

  static fromDB(data: RowDataPacket): Queue {
    const queueEntry = new Queue(
      data.id,
      data.id_player,
      data.ip,
      data.port,
      new Date(data.date_entry),
      data.priority
    );

    if (data.pseudo) {
      queueEntry.attachPlayer(new Players(data.id_player, data.pseudo, data.created_at));
    }

    return queueEntry;
  }

  
  toDB(): Record<string, any> {
    return {
      id_player: this.id_player,
      ip: this.ip,
      port: this.port,
      date_entry: this.date_entry.toISOString().slice(0, 19).replace("T", " "),
      priority: this.priority,
    };
  }

  // Récupérer toutes les entrées de la file d'attente
  static async getAllQueueEntries(): Promise<Queue[]> {
    try {
      const [rows] = await promisePool.query<RowDataPacket[]>(
        `SELECT q.id, q.id_player, q.ip, q.port, q.date_entry, q.priority, 
                p.id_player, p.pseudo, p.created_at 
         FROM queue q
         LEFT JOIN players p ON q.id_player = p.id_player
         ORDER BY q.priority ASC, q.date_entry ASC`
      );

      return rows.map((row) => Queue.fromDB(row));
    } catch (error) {
      console.error("Erreur lors de la récupération de la file d'attente :", error);
      return [];
    }
  }

  // Ajouter un joueur à la file d'attente
  static async createQueueEntry(
    playerId: number,
    ip: string,
    port: number,
    date_entry: Date,
    priority: number
  ): Promise<Queue | null> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO queue (id_player, ip, port, date_entry, priority) VALUES (?,?,?,?,?)",
        [playerId, ip, port, date_entry, priority]
      );

      if (result.affectedRows > 0) {
        return new Queue(result.insertId, playerId, ip, port, date_entry, priority);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de l'insertion d'une nouvelle entrée dans la queue :", error);
      return null;
    }
  }

  // Modifier le joueur associé à une entrée dans la file d'attente
  static async updateQueueEntryPlayer(id: number, playerId: number): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        "UPDATE queue SET id_player =? WHERE id =?",
        [playerId, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la modification du joueur de l'entrée ${id} :`, error);
      return false;
    }
  }

  // Modifier une file d'attente
  static async updateQueue(id: number, ip: string, port: number): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        "UPDATE queue SET ip =?, port =? WHERE id =?",
        [ip, port, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la modification de l'entrée ${id} :`, error);
      return false;
    }
  }

  // Modifier la priorité d'une entrée dans la file d'attente
  static async updateQueueEntryPriority(id: number, priority: number): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        "UPDATE queue SET priority =? WHERE id =?",
        [priority, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la modification de la priorité de l'entrée ${id} :`, error);
      return false;
    }
  }
  // Supprimer une entrée dans la file d'attente par ID
  static async removeQueueEntryById(id: number): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        "DELETE FROM queue WHERE id =?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'entrée ${id} dans la queue :`, error);
      return false;
    }
  }

  // Supprimer un joueur de la file d'attente par ID joueur
  static async removeQueueEntryByPlayerId(playerId: number): Promise<boolean> {
    try {
      const [result] = await promisePool.query<ResultSetHeader>(
        "DELETE FROM queue WHERE id_player = ?",
        [playerId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'entrée dans la queue pour le joueur ${playerId} :`, error);
      return false;
    }
  }

  // Supprimer toute la file d'attente
  static async clearQueue(): Promise<boolean> {
    try {
      await promisePool.query("DELETE FROM queue");
      return true;
    } catch (error) {
      console.error("Erreur lors du nettoyage de la file d'attente :", error);
      return false;
    }
  }
}


