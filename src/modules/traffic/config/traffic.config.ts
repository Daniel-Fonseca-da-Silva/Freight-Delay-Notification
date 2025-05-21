import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrafficConfig {
  constructor(private readonly configService: ConfigService) {}

  get apiKey(): string {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY not configured');
    }
    return apiKey;
  }
}
 