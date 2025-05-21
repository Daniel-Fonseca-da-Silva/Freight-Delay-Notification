import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TrafficData } from '../interfaces/traffic-data.interface';
import { logger } from '../../../shared/utils/logger';
import { EmailService } from '../../email/services/email.service';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateFriendlyMessage(trafficData: TrafficData): Promise<string> {
    const prompt = this.buildPrompt(trafficData);
    
    try {
      const response = await this.openai.responses.create({
        model: "gpt-4o-mini",
        input: prompt
      });

      const message = response.output_text;
      logger.info(`Friendly message generated: ${message}`);

      // Send email notification
      await this.emailService.sendEmail(
        'Traffic Update Notification',
        message
      );

      return message;
    } catch (error) {
      logger.error(`Error generating friendly message: ${error.message}`);
      throw new Error(`Error generating friendly message: ${error.message}`);
    }
  }

  private buildPrompt(trafficData: TrafficData): string {
    return `
      Based on the following traffic data, create a friendly and informative message:
      
      Traffic status: ${trafficData.status}
      Current travel duration: ${trafficData.currentDuration} minutes
      Normal travel duration: ${trafficData.normalDuration} minutes
      Delay: ${trafficData.delay} minutes
      Total distance: ${trafficData.distance} km
      
      Please provide a message that:
      1. Be professional and short
      2. Explains the traffic situation clearly
      3. Provides useful information about the delay
      4. Suggests alternatives if there is a significant delay
    `;
  }
} 
