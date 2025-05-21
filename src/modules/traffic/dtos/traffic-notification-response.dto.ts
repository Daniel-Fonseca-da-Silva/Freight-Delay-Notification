import { ApiProperty } from '@nestjs/swagger';
import { TrafficDataDto } from './traffic-data.dto';

export class TrafficNotificationResponseDto {
  @ApiProperty({
    description: 'Traffic data including status, duration, and delay information',
    type: TrafficDataDto,
  })
  trafficData: TrafficDataDto;

  @ApiProperty({
    description: 'Friendly notification message sent to customers',
    type: String,
    example: 'Olá! Informamos que há tráfego intenso na sua rota. O tempo normal de viagem é de 30 minutos, mas atualmente está levando 45 minutos, com um atraso de 15 minutos.',
  })
  notificationMessage: string;
} 