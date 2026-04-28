export interface SensorData {
  id?: string | number;
  distancia: number;
  lux: number;
  created_at: string;
}

export interface AlertEvent {
  id: string;
  type: 'distancia' | 'luz';
  value: number;
  threshold: number;
  message: string;
  timestamp: string;
}
