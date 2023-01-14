import { Provider } from '@nestjs/common';
import { FamoneyLoggerService } from './famoney-logger.service';
import { getFamoneyLoggerToken } from './famoney-logger.utils';

function loggerFactory(logger: FamoneyLoggerService, context?: string) {
  if (context) {
    logger.setContext(context);
  }
  return logger;
}

function createLoggerProvider(context: string): Provider<FamoneyLoggerService> {
  return {
    provide: getFamoneyLoggerToken(context),
    useFactory: logger => loggerFactory(logger, context),
    inject: [FamoneyLoggerService],
  };
}

export function createLoggerProviders(contexts: string[]): Array<Provider<FamoneyLoggerService>> {
  return contexts.map(context => createLoggerProvider(context));
}