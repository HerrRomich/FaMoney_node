import { Module } from '@nestjs/common';
import { Pool, types } from 'pg';
import { TransactionManagerService } from './services/transaction-manager.service';

@Module({
  providers: [
    {
      provide: Pool,
      useFactory: () => {
        types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));
        types.setTypeParser(types.builtins.DATE, (val) => new Date(val));
        return new Pool({
          host: 'localhost',
          port: 5432,
          user: 'postgres',
          password: 'welcome1',
          database: 'postgres',
        });
      },
    },
    TransactionManagerService,
  ],
  exports: [Pool, TransactionManagerService],
})
export class CommonsDomainModule {}
