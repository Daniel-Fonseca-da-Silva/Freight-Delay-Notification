import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TrafficStatus } from '../interfaces/traffic.interface';
import { TrafficAnalyzerInterface } from '../interfaces/traffic-analyzer.interface';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class TrafficAnalyzerService implements TrafficAnalyzerInterface {
  private readonly delayThreshold: number;

  constructor(private readonly configService: ConfigService) {
    this.delayThreshold = this.configService.get<number>('DELAY_THRESHOLD_MINUTES') || 30;
    logger.info(`Delay threshold set to ${this.delayThreshold} minutes`);
  }

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
    if (delay < this.delayThreshold) return TrafficStatus.DELAYED;
    return TrafficStatus.HEAVY_DELAY;
  }

  /**
   * Checks if the delay exceeds the configured threshold
   * @param delay - Delay in minutes
   * @returns boolean indicating if notification should be sent
   */
  shouldSendNotification(delay: number): boolean {
    return delay >= this.delayThreshold;
  }
} 