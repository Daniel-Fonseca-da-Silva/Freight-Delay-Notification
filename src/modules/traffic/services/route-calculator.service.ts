import { Injectable } from '@nestjs/common';
import { Client, TrafficModel } from '@googlemaps/google-maps-services-js';
import { TrafficConfig } from '../config/traffic.config';
import { RouteCalculatorInterface, RouteData } from '../interfaces/route-calculator.interface';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class RouteCalculatorService implements RouteCalculatorInterface {
  private readonly client: Client;

  constructor(private readonly trafficConfig: TrafficConfig) {
    this.client = new Client({});
    logger.setContext('RouteCalculatorService');
  }

  // Calculate the route with current traffic origin and destination
  async getRouteWithTraffic(origin: string, destination: string): Promise<RouteData> {
    try {
      logger.info('Calculating route with current traffic', { origin, destination });

      const response = await this.client.directions({
        params: {
          origin,
          destination,
          key: this.trafficConfig.apiKey,
          departure_time: 'now',
          traffic_model: TrafficModel.best_guess,
        },
      });

      const route = response.data.routes[0].legs[0];
      const durationInTraffic = route.duration_in_traffic?.value ?? route.duration.value;
      const result = {
        duration: Math.ceil(durationInTraffic / 60),
        distance: route.distance.value,
      };

      logger.info('Route with traffic calculated successfully', {
        origin,
        destination,
        ...result,
      });

      return result;
    } catch (error) {
      logger.error('Error calculating route with traffic', error.stack, {
        origin,
        destination,
        error: error.message,
      });
      throw error;
    }
  }

  // Calculate the route without traffic origin and destination
  async getRouteWithoutTraffic(origin: string, destination: string): Promise<RouteData> {
    try {
      logger.info('Calculating route without traffic', { origin, destination });

      const response = await this.client.directions({
        params: {
          origin,
          destination,
          key: this.trafficConfig.apiKey,
          departure_time: 'now',
          traffic_model: TrafficModel.optimistic,
        },
      });

      const route = response.data.routes[0].legs[0];
      const result = {
        duration: Math.ceil(route.duration.value / 60),
        distance: route.distance.value,
      };

      logger.info('Route without traffic calculated successfully', {
        origin,
        destination,
        ...result,
      });

      return result;
    } catch (error) {
      logger.error('Error calculating route without traffic', error.stack, {
        origin,
        destination,
        error: error.message,
      });
      throw error;
    }
  }
} 