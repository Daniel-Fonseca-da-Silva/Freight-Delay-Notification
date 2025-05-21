import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define the structure of the request with validations
export class TrafficRequestDto {
  @ApiProperty({
    description: 'Origin location',
    example: 'Coimbra, Portugal',
  })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({
    description: 'Destination location',
    example: 'Lisbon, Portugal',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;
} 