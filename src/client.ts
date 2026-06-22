import axios, { AxiosInstance } from 'axios';

export interface VelixClientConfig {
  apiUrl: string;
  apiKey: string;
  timeout?: number;
}

export class VelixClient {
  readonly http: AxiosInstance;

  constructor(config: VelixClientConfig) {
    this.http = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout ?? 10000,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
