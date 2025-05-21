import { Injectable } from '@nestjs/common';
import { TrafficStatus } from '../interfaces/traffic.interface';
import { TrafficAnalyzerInterface } from '../interfaces/traffic-analyzer.interface';

@Injectable()
export class TrafficAnalyzerService implements TrafficAnalyzerInterface {
  /**
   * Calculates the delay between current and normal duration
   * @param currentDuration - Current duration in minutes
   * @param normalDuration - Normal duration in minutes
   * @returns Delay in minutes
   */
  calculateDelay(currentDuration: number, normalDuration: number): number {
    return Math.max(0, currentDuration - normalDuration);
  }

  /**
   * Determines the traffic status based on the delay
   * @param delay - Delay in minutes
   * @returns Traffic status
   */
  determineTrafficStatus(delay: number): TrafficStatus {
    if (delay === 0) return TrafficStatus.NORMAL;
    if (delay <= 30) return TrafficStatus.DELAYED;
    return TrafficStatus.HEAVY_DELAY;
  }
} 