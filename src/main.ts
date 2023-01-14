import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston/dist/winston.module';
import winston from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'verbose',
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}][${info.level}][${info.context} -> ${info.message}]` + (info.stack ? `
${info.stack}` : '')
            ),
          ),
        }),
      ],
    }),
  });
  const config = new DocumentBuilder()
    .setTitle('FaMoney')
    .setDescription('Family money.')
    .setVersion('1.0')
    .addTag('famoney')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
