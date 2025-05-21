import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Freight Delay Notification API')
    .setDescription('API documentation for Freight Delay Notification system')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
