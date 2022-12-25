import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston/dist/winston.module';
import winston from 'winston';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf((info) => `[${info.timestamp}][${info.level}][${info.context} -> ${info.message}]`),
        )
      })]
    })
  });
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
