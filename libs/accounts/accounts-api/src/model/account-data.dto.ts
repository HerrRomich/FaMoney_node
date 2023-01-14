import { Properties } from '@famoney/commons-api';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { formatISO, parseISO } from 'date-fns';

export class AccountDataDTO {
  constructor(data: Properties<AccountDataDTO>) {
    Object.assign(this, data);
  }

  @ApiProperty()
  readonly name!: string;
  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => formatISO(value as Date, {representation: 'date'}), {
    toPlainOnly: true,
  })
  @Transform(({ value }) => parseISO(value), {
    toClassOnly: true,
  })
  readonly openDate!: Date;
  @ApiProperty()
  readonly tags!: string[];
}
