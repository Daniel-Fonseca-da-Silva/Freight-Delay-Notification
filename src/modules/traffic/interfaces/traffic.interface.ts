// Interface that define a structure of traffic data
export interface TrafficData {
  origin: string;
  destination: string;
  currentDuration: number; // current duration in minutes
  normalDuration: number; // normal duration in minutes
  delay: number; // delay in minutes
  distance: number; // distance in meters
  status: TrafficStatus;
}

// Enum that define the possible traffic status
export enum TrafficStatus {
  NORMAL = 'NORMAL',
  DELAYED = 'DELAYED',
  HEAVY_DELAY = 'HEAVY_DELAY',
  ERROR = 'ERROR',
}

// Interface that define the traffic service
export interface TrafficServiceInterface {
  getTrafficData(origin: string, destination: string): Promise<TrafficData>;
} 