import { Injectable } from '@nestjs/common/decorators';
import { ClientBase, Pool } from 'pg';

@Injectable()
export class TransactionManagerService {
  constructor(private conectionPool: Pool) {}

  async callTransactional<T>(call: (conn: ClientBase) => Promise<T>) {
    const conn = await this.conectionPool.connect();
    try {
      await conn.query('BEGIN');
      const result = await call(conn);
      await conn.query('COMMIT');
      return result;
    } catch (e) {
      await conn.query('ROLLBACK');
      throw e;
    } finally {
      conn.release();
    }
  }
}
