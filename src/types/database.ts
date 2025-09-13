export type SpeedResultRow = {
  id: string;
  user_id?: string | null;
  ip: string;
  isp: string;
  server_id: string;
  server_city: string;
  server_country: string;
  ping: number;
  jitter: number;
  loss: number;
  download: number;
  upload: number;
  route_latency: number;
  stability_score: number;
  created_at: string;
};