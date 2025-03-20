// network.ts
import axios, { AxiosInstance } from "axios";

class Network {
  private api: AxiosInstance;

  constructor(baseUrl: string) {
    this.api = axios.create({ baseURL: baseUrl });
  }

  async get(endpoint: string) {
    const response = await this.api.get(endpoint);
    return response.data;
  }

  async post(endpoint: string, data: any) {
    const response = await this.api.post(endpoint, data);
    return response.data;
  }

  async delete(endpoint: string) {
    const response = await this.api.delete(endpoint);
    return response.data;
  }
}

export { Network };
