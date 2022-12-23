import { Module } from '@nestjs/common';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [],
})
export class AccountsApiModule {}
