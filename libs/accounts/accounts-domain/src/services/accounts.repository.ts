import { TransactionManagerService } from '@famoney/commons-domain';
import { FamoneyLogger, FamoneyLoggerService } from '@famoney/commons-logger';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../model';

@Injectable()
export class AccountsRepository {
  constructor(
    private transactionManager: TransactionManagerService,
    @FamoneyLogger('AccountsRepository') private logger: FamoneyLoggerService,
  ) {}

  private static readonly SELECT_ACCOUNT_QUERY = `
select a.id
     , a.name
     , a.open_date
    , (select array_agg(t.tag) from accounts.account_tag t where t.account_id = a.id) tags
    , a.movement_count
    , a.movement_total
  from accounts.account a 
 where a.id = $1`;

  private static readonly SELECT_ACCOUNTS_QUERY = `
select a.id
     , a.name
     , a.open_date
     , (select array_agg(t.tag) from accounts.account_tag t where t.account_id = a.id) tags
     , a.movement_count
     , a.movement_total
  from accounts.account a 
 where exists (select 1 
                 from accounts.account_tag t 
                where t.account_id = a.id 
                  and t.tag = any($1)
              )
           or array_length($1, 1) is null`;

  private static readonly INSERT_ACCOUNTS_QUERY = `
insert into accounts.account(budget_id, name, open_date, movement_count, movement_total)
                    values(1, $1, $2, 0, 0) RETURNING id`;

  private static readonly INSERT_TAGS_QUERY = `
insert into accounts.account_tag(account_id, tag)
                    values($1, $2)`;

  private static readonly UPDATE_ACCOUNTS_QUERY = `
update accounts.account
   set name = $1,
       open_date = $2
 where id = $3`;

  private static readonly DELETE_ACCOUNT_QUERY = `
delete from accounts.account a
 where a.id = $1`;

  private static readonly DELETE_TAGS_QUERY = `
delete from accounts.account_tag
 where account_id = $1`;

  async getAccountById(accountId: number) {
    return this.transactionManager.callTransactional(async (conn) => {
      const result = await conn.query(AccountsRepository.SELECT_ACCOUNT_QUERY, [
        accountId,
      ]);
      if (result.rowCount !== 1) {
        return undefined;
      } else {
        return this.readAccountEntity(result.rows[0]);
      }
    });
  }

  async getAllAccounts(tags: string[]) {
    return this.transactionManager.callTransactional(async (conn) => {
      const result = await conn.query(
        AccountsRepository.SELECT_ACCOUNTS_QUERY,
        [tags],
      );
      await conn.query('COMMIT');
      return result.rows.map((row) => this.readAccountEntity(row));
    });
  }

  async addAccount(accountEntity: AccountEntity) {
    return this.transactionManager.callTransactional(async (conn) => {
      const idResult = await conn.query(
        AccountsRepository.INSERT_ACCOUNTS_QUERY,
        [accountEntity.name, accountEntity.openDate],
      );
      const accountId: number = idResult.rows[0].id;
      for (const tag of accountEntity.tags) {
        await conn.query(AccountsRepository.INSERT_TAGS_QUERY, [
          accountId,
          tag,
        ]);
      }
      const resultEntity = await this.getAccountById(accountId);
      if (resultEntity === undefined) {
        throw Error(
          `Something is gone wrong. account with id: ${accountId} wath not added.`,
        );
      }
      return resultEntity;
    });
  }

  async changeAccount(accountEntity: AccountEntity) {
    return this.transactionManager.callTransactional(async (conn) => {
      await conn.query(AccountsRepository.DELETE_TAGS_QUERY, [
        accountEntity.id,
      ]);
      await conn.query(AccountsRepository.UPDATE_ACCOUNTS_QUERY, [
        accountEntity.name,
        accountEntity.openDate,
        accountEntity.id,
      ]);
      for (const tag of accountEntity.tags) {
        await conn.query(AccountsRepository.INSERT_TAGS_QUERY, [
          accountEntity.id,
          tag,
        ]);
      }
      const result = await conn.query(AccountsRepository.SELECT_ACCOUNT_QUERY, [
        accountEntity.id,
      ]);
      return this.readAccountEntity(result.rows[0]);
    });
  }

  async deleteAccount(accountId: number) {
    return this.transactionManager.callTransactional(async (conn) => {
      await conn.query(AccountsRepository.DELETE_TAGS_QUERY, [accountId]);
      await conn.query(AccountsRepository.DELETE_ACCOUNT_QUERY, [accountId]);
    });
  }

  private readAccountEntity(row: any) {
    const accountEntry: AccountEntity = {
      id: row.id,
      name: row.name,
      openDate: row.open_date,
      tags: row.tags ?? [],
      movementCount: row.movement_count,
      movementTotal: row.movement_total,
    };
    return accountEntry;
  }
}
