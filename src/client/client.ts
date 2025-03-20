// client.ts
import { Network } from "./network";

class Client {
  private network: Network;
  private playerId: number;
  
  constructor(playerId: number, serverUrl: string) {
    this.playerId = playerId;
    this.network = new Network(serverUrl);
  }

  async joinQueue(priority: number) {
    try {
      const response = await this.network.post(`/queue/${this.playerId}`, { priority });
      console.log("Réponse du serveur:", response);
    } catch (error) {
      console.error("Erreur lors de l'ajout à la file d'attente:", error);
    }
  }

  async getQueueStatus() {
    try {
      const queue = await this.network.get(`/queue`);
      console.log("File d'attente:", queue);
    } catch (error) {
      console.error("Erreur lors de la récupération de la file d'attente:", error);
    }
  }
}

export { Client };
