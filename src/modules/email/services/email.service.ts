import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class EmailService {
  private readonly customers: string[];

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }
    SendGrid.setApiKey(apiKey);
    this.customers = this.loadCustomers();
    logger.info(`Loaded ${this.customers.length} customer emails`);
  }

  private loadCustomers(): string[] {
    try {
      const customersPath = path.join(process.cwd(), 'src', 'config', 'customers.txt');
      const content = fs.readFileSync(customersPath, 'utf-8');
      const emails = content.split('\n').filter(email => email.trim() !== '');
      logger.info(`Loaded customer emails: ${emails.join(', ')}`);
      return emails;
    } catch (error) {
      logger.error(`Error loading customers: ${error.message}`);
      return [];
    }
  }

  async sendEmail(subject: string, message: string): Promise<void> {
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    if (!fromEmail) {
      throw new Error('SENDGRID_FROM_EMAIL is not configured');
    }

    if (this.customers.length === 0) {
      throw new Error('No customer emails found to send to');
    }

    const msg: SendGrid.MailDataRequired = {
      to: this.customers,
      from: fromEmail,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    try {
      logger.info(`Attempting to send email to: ${this.customers.join(', ')}`);
      logger.info(`From email: ${fromEmail}`);
      
      const response = await SendGrid.send(msg);
      logger.info(`Email sent successfully. Status code: ${response[0].statusCode}`);
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`);
      if (error.response) {
        logger.error(`SendGrid API Error Details: ${JSON.stringify(error.response.body)}`);
      }
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
} 