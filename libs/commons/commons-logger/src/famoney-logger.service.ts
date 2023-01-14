import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class FamoneyLoggerService {
  private context?: string;

  constructor(private logger: Logger) {}

  error(message: any, stack?: string): void {
    this.logger.error(message, stack, this.context);
  }

  log(message: any): void {
    this.logger.log(message, this.context);
  }

  info(message: any): void {
    this.logger.log(message, this.context);
  }

  warn(message: any): void {
    this.logger.warn(message, this.context);
  }

  debug(message: any): void {
    this.logger.debug(message, this.context);
  }

  verbose(message: any): void {
    this.logger.verbose(message, this.context);
  }

  setContext(context: string) {
    this.context = context;
  }
}
