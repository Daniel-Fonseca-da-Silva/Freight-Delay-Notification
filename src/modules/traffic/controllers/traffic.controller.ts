import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TrafficService } from '../services/traffic.service';
import { TrafficRequestDto } from '../dtos/traffic-request.dto';
import { TrafficData, TrafficStatus } from '../interfaces/traffic.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrafficNotificationResponseDto } from '../dtos/traffic-notification-response.dto';
import { AiService } from '../../ai/services/ai.service';
import { TrafficAnalyzerService } from '../services/traffic-analyzer.service';
import { logger } from '../../../shared/utils/logger';

@ApiTags('Traffic')
@Controller({
  path: 'traffic',
  version: '1'
})
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    private readonly aiService: AiService,
    private readonly trafficAnalyzer: TrafficAnalyzerService,
  ) {}

  @Post('check')
  @ApiOperation({ summary: 'Check traffic conditions between two locations and send notification' })
  @ApiResponse({
    status: 201,
    description: 'Traffic data retrieved and notification sent successfully',
    type: TrafficNotificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid address provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Route not found between the provided locations',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async checkTraffic(@Body() trafficRequest: TrafficRequestDto): Promise<TrafficNotificationResponseDto> {
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

      let notificationMessage = '';
      
      // Only generate and send notification if delay exceeds threshold
      if (this.trafficAnalyzer.shouldSendNotification(trafficData.delay)) {
        logger.info(`Delay of ${trafficData.delay} minutes exceeds threshold, sending notification`);
        notificationMessage = await this.aiService.generateFriendlyMessage(trafficData);
      } else {
        logger.info(`Delay of ${trafficData.delay} minutes is below threshold, no notification needed`);
      }

      return {
        trafficData,
        notificationMessage,
      };
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