
import { Inject } from '@nestjs/common';
import { getFamoneyLoggerToken } from './famoney-logger.utils';
import { FamoneyLoggerModule } from './famoney-logger.module';

export function FamoneyLogger(context: string = '') {
  if (!FamoneyLoggerModule.contextsForLoggers.includes(context)) {
    FamoneyLoggerModule.contextsForLoggers.push(context);
  }
  return Inject(getFamoneyLoggerToken(context));
}