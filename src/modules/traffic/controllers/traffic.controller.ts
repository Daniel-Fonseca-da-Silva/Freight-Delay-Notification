import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TrafficService } from '../services/traffic.service';
import { TrafficRequestDto } from '../dtos/traffic-request.dto';
import { TrafficData, TrafficStatus } from '../interfaces/traffic.interface';

@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post('check')
  async checkTraffic(@Body() trafficRequest: TrafficRequestDto): Promise<TrafficData> {
    try {
      const trafficData = await this.trafficService.getTrafficData(
        trafficRequest.origin,
        trafficRequest.destination,
      );

      if (trafficData.status === TrafficStatus.ERROR) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Route not found',
            message: 'Could not find a valid route between the provided locations',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return trafficData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Specific treatment for invalid address errors
      if (error.message?.includes('Address not found') ||
          error.message?.includes('Invalid address')) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Invalid address',
            message: 'One or both addresses provided are invalid or not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error checking traffic',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 