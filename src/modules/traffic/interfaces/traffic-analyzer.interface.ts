import { TrafficStatus } from './traffic.interface';

export interface TrafficAnalyzerInterface {
  /**
   * Calculates the delay between current and normal duration
   * @param currentDuration - Current duration in minutes
   * @param normalDuration - Normal duration in minutes
   * @returns Delay in minutes
   */
  calculateDelay(currentDuration: number, normalDuration: number): number;

  /**
   * Determines the traffic status based on the delay
   * @param delay - Delay in minutes
   * @returns Traffic status
   */
  determineTrafficStatus(delay: number): TrafficStatus;
} 