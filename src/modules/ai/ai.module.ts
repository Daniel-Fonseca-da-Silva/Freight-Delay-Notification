import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './services/ai.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ConfigModule, EmailModule],
  controllers: [],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
