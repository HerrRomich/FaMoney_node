import { AccountsApiModule } from '@famoney/accounts-api';
import { FamoneyLoggerModule } from '@famoney/commons-logger';
import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [AccountsApiModule, FamoneyLoggerModule.forRoot()],
  controllers: [],
})
export class AppModule {}
