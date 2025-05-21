import { ApiProperty } from '@nestjs/swagger';
import { TrafficStatus } from '../interfaces/traffic.interface';

export class TrafficDataDto {
  @ApiProperty({
    description: 'Current traffic status',
    enum: TrafficStatus,
    example: TrafficStatus.HEAVY_DELAY,
  })
  status: TrafficStatus;

  @ApiProperty({
    description: 'Current travel duration in minutes',
    type: Number,
    example: 45,
  })
  currentDuration: number;

  @ApiProperty({
    description: 'Normal travel duration in minutes',
    type: Number,
    example: 30,
  })
  normalDuration: number;

  @ApiProperty({
    description: 'Delay in minutes',
    type: Number,
    example: 15,
  })
  delay: number;

  @ApiProperty({
    description: 'Total distance in kilometers',
    type: Number,
    example: 10.5,
  })
  distance: number;
} 