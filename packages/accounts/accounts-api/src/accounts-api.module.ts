import { AccountsDomainModule } from '@famoney/accounts-domain';
import { Module } from '@nestjs/common';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [AccountsDomainModule],
  controllers: [AccountsController],
  providers: [],
})
export class AccountsApiModule {}
