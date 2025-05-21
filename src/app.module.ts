import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrafficModule } from './modules/traffic/traffic.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TrafficModule,
    AiModule,
  ],
})
export class AppModule {}
