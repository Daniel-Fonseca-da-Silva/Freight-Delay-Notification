import { ApiProperty } from '@nestjs/swagger';
import { TrafficStatus } from '../interfaces/traffic.interface';

export class TrafficResponseDto {
  @ApiProperty({
    description: 'Origin location',
    example: 'Coimbra, Portugal',
  })
  origin: string;

  @ApiProperty({
    description: 'Destination location',
    example: 'Lisbon, Portugal',
  })
  destination: string;

  @ApiProperty({
    description: 'Current duration in minutes',
    example: 130,
  })
  currentDuration: number;

  @ApiProperty({
    description: 'Normal duration in minutes without traffic',
    example: 128,
  })
  normalDuration: number;

  @ApiProperty({
    description: 'Delay in minutes',
    example: 2,
  })
  delay: number;

  @ApiProperty({
    description: 'Distance in meters',
    example: 202430,
  })
  distance: number;

  @ApiProperty({
    description: 'Traffic status',
    enum: TrafficStatus,
    example: TrafficStatus.DELAYED,
  })
  status: TrafficStatus;
} 