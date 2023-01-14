import { IdDTO, Properties } from '@famoney/commons-api';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { AccountDataDTO } from './account-data.dto';

export interface AccountDTO extends IdDTO, AccountDataDTO {}

export class AccountDTO extends IntersectionType(IdDTO, AccountDataDTO) {
  constructor(data: Properties<AccountDTO>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty()
  movementCount!: number;
  @ApiProperty()
  total!: number;
}

applyMixins(AccountDTO, [IdDTO, AccountDataDTO]);

function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null),
      );
    });
  });
}
