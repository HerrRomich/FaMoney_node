
import { DynamicModule, Logger } from '@nestjs/common';
import { FamoneyLoggerService } from './famoney-logger.service';
import { createLoggerProviders } from './famoney-logger.providers';

export class FamoneyLoggerModule {
  static contextsForLoggers: string[] = new Array<string>();
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createLoggerProviders(this.contextsForLoggers);
    return {
      module: FamoneyLoggerModule,
      providers: [FamoneyLoggerService, ...prefixedLoggerProviders, Logger],
      exports: [FamoneyLoggerService, ...prefixedLoggerProviders],
    };
  }
}