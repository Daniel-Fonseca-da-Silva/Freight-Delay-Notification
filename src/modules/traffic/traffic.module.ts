import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrafficService } from './services/traffic.service';
import { RouteCalculatorService } from './services/route-calculator.service';
import { TrafficAnalyzerService } from './services/traffic-analyzer.service';
import { TrafficConfig } from './config/traffic.config';
import { TrafficController } from './controllers/traffic.controller';

// Register the service and its dependencies
// Export the service to be used in other modules
@Module({
  imports: [ConfigModule],
  controllers: [TrafficController],
  providers: [
    TrafficService,
    RouteCalculatorService,
    TrafficAnalyzerService,
    TrafficConfig,
  ],
  exports: [TrafficService],
})
export class TrafficModule {} 