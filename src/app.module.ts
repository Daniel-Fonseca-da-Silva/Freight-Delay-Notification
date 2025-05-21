import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrafficModule } from './modules/traffic/traffic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TrafficModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
