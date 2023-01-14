import { FamoneyLogger, FamoneyLoggerService } from '@famoney/commons-logger';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import runner from 'node-pg-migrate';
import path from 'path';
import { Pool } from 'pg';

@Injectable()
export class AccountsMigration implements OnModuleInit {
  constructor(private connectionPool: Pool, @FamoneyLogger('MigrationRunner') private logger: FamoneyLoggerService,) {}

  async onModuleInit() {
    const conn = await this.connectionPool.connect();
    try {
      await runner({
        dbClient: conn,
        schema: 'accounts',
        createSchema: true,
        dir: path.resolve(__dirname, 'migrations/accounts'),
        migrationsSchema: 'famoney',
        createMigrationsSchema: true, 
        migrationsTable: 'accounts-migrations',
        direction: 'up', 
        ignorePattern: '(.*\\.d\\.ts)|(.*\\.js\\.map)|(.*\\.json)',
        singleTransaction: true,
        logger: this.logger
      });
    } finally {
      conn.release();
    }
  }
}
