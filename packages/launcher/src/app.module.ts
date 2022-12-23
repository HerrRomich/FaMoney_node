import { AccountsApiModule } from '@famoney/accounts-api';
import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [AccountsApiModule],
  controllers: [],
  providers: [Logger],
})
export class AppModule { }
