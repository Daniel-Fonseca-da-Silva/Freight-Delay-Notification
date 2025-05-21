import { IsString, IsNotEmpty } from 'class-validator';

// Define the structure of the request with validations
export class TrafficRequestDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;
} 