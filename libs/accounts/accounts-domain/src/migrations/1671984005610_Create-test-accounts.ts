/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import accountsData from './accounts.data.json';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder) {
  const tagsToAccountIds: Record<string, Array<number>> = {};
  for (const account of accountsData.accounts) {
    const rec = await pgm.db.query({
      text: 'insert into account(budget_id, name, open_date, movement_count, movement_total) values($1, $2, $3, $4, $5) returning id',
      values: [1, account.name, Date.parse(account.openDate), 0, 0],
    });
    account.tags.forEach(tag => {
        const accountIds = tagsToAccountIds[tag] ?? [];
        accountIds.push(rec.rows[0].id);
        tagsToAccountIds[tag] = accountIds
    });
  }
  for (const tag in tagsToAccountIds) {
    for (const accountId of tagsToAccountIds[tag]) {
        await pgm.db.query({
            text: 'insert into account_tag(account_id, tag) values($1, $2)',
            values: [accountId, tag]
        });
    }
  }
}
