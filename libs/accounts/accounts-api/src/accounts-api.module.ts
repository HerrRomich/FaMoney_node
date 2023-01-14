import { AccountsDomainModule } from '@famoney/accounts-domain';
import { FamoneyLoggerModule } from '@famoney/commons-logger';
import { Module } from '@nestjs/common';
import { AccountMovementsController } from './controllers/account-movements.controller';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [AccountsDomainModule, FamoneyLoggerModule.forRoot()],
  controllers: [AccountsController, AccountMovementsController],
})
export class AccountsApiModule {}
