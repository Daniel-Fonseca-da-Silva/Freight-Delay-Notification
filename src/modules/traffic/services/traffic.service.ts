import { Injectable } from '@nestjs/common';
import { TrafficData, TrafficServiceInterface, TrafficStatus } from '../interfaces/traffic.interface';
import { RouteCalculatorService } from './route-calculator.service';
import { TrafficAnalyzerService } from './traffic-analyzer.service';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class TrafficService implements TrafficServiceInterface {
  constructor(
    private readonly routeCalculator: RouteCalculatorService,
    private readonly trafficAnalyzer: TrafficAnalyzerService,
  ) {
    logger.setContext('TrafficService');
  }

  // Get the traffic data origin and destination
  async getTrafficData(origin: string, destination: string): Promise<TrafficData> {
    try {
      logger.info('Starting traffic analysis', { origin, destination });

      const [currentRoute, normalRoute] = await Promise.all([
        this.routeCalculator.getRouteWithTraffic(origin, destination),
        this.routeCalculator.getRouteWithoutTraffic(origin, destination),
      ]);

      const currentDuration = currentRoute.duration;
      const normalDuration = normalRoute.duration;
      const delay = this.trafficAnalyzer.calculateDelay(currentDuration, normalDuration);
      const status = this.trafficAnalyzer.determineTrafficStatus(delay);

      logger.info('Traffic analysis completed', {
        origin,
        destination,
        currentDuration,
        normalDuration,
        delay,
        distance: currentRoute.distance,
        status,
      });

      return {
        origin,
        destination,
        currentDuration,
        normalDuration,
        delay,
        distance: currentRoute.distance,
        status,
      };
    } catch (error) {
      logger.error('Error getting traffic data', error.stack, {
        origin,
        destination,
        error: error.message,
      });
      return this.createErrorResponse(origin, destination);
    }
  }

  // Create the error response for the traffic data
  private createErrorResponse(origin: string, destination: string): TrafficData {
    logger.warn('Creating error response for traffic data', {
      origin,
      destination,
    });

    return {
      origin,
      destination,
      currentDuration: 0,
      normalDuration: 0,
      delay: 0,
      distance: 0,
      status: TrafficStatus.ERROR,
    };
  }
} 