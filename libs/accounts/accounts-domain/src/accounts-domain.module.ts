import { CommonsDomainModule } from '@famoney/commons-domain';
import { FamoneyLoggerModule } from '@famoney/commons-logger';
import { Logger, Module } from '@nestjs/common';
import { AccountsMigration } from './services/accounts.migration';
import { AccountsRepository } from './services/accounts.repository';

@Module({
  imports: [CommonsDomainModule, FamoneyLoggerModule.forRoot()],
  providers: [
    {
      provide: AccountsMigration,
      useClass: AccountsMigration,
    },
    {
      provide: AccountsRepository,
      useClass: AccountsRepository,
    },
    Logger,
  ],
  exports: [AccountsRepository]
}) 
export class AccountsDomainModule {}
