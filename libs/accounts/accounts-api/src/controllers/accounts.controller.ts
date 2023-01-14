import { AccountEntity } from '@famoney/accounts-domain';
import { AccountsRepository } from '@famoney/accounts-domain';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCode, Sse } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FamoneyLogger, FamoneyLoggerService } from '@famoney/commons-logger';
import { AccountDataDTO, AccountDTO } from '../model';
import { Observable, of } from 'rxjs';

@Controller({
  path: 'accounts',
})
@UseInterceptors(ClassSerializerInterceptor)
export class AccountsController {
  constructor(
    private accountsRepository: AccountsRepository,
    @FamoneyLogger('AccountsController') private logger: FamoneyLoggerService,
  ) {}

  @Get()
  @ApiQuery({ name: 'tags', type: [String], required: false })
  @ApiOkResponse({ type: [AccountDTO] })
  async getAllAccounts(
    @Query('tags', new ParseArrayPipe({ optional: true })) tags?: string[],
  ): Promise<AccountDTO[]> {
    tags = tags ?? [];
    this.logger.verbose(`"Getting all accounts by ${tags.length} tag(s).`);
    this.logger.debug(`Getting all accounts by tag(s): 
${JSON.stringify(tags, null, 2)}
`);
    const accountEntries = await this.accountsRepository.getAllAccounts(tags);
    const accountDTOs: AccountDTO[] = accountEntries.map((accountEntry) =>
      this.mapAccountToDTO(accountEntry),
    );
    this.logger.verbose(`Got ${accountDTOs.length} accounts.`);
    this.logger.debug(`Got accounts: 
${JSON.stringify(accountDTOs, null, 2)}
`);
    return accountDTOs;
  }

  @Post()
  @ApiCreatedResponse({
    type: AccountDTO,
  })
  @HttpCode(201)
  async addAccount(@Body() accountData: AccountDataDTO) {
    this.logger.verbose(`"Creating account.`);
    this.logger.debug(`Creating account with data: 
${JSON.stringify(accountData, null, 2)}
    `);
    let accountEntity: AccountEntity = {
      id: 0,
      name: accountData.name,
      openDate: accountData.openDate,
      tags: [...accountData.tags],
      movementCount: 0.0,
      movementTotal: 0,
    };
    accountEntity = await this.accountsRepository.addAccount(accountEntity);
    const accountDTO = this.mapAccountToDTO(accountEntity);
    this.logger.verbose(`"Created account id: ${accountDTO.id}.`);
    this.logger.debug(`Created account with data: 
${JSON.stringify(accountDTO, null, 2)}
    `);
    return accountDTO;
  }

  @Put()
  @ApiCreatedResponse({
    type: AccountDTO,
  })
  @ApiBadRequestResponse({})
  async changeAccount(
    @Query('account-id') accountId: number,
    @Body(new ValidationPipe({ transform: true })) accountData: AccountDataDTO,
  ) {
    this.logger.verbose(`Changing account id: ${accountId}.`);
    this.logger.debug(`Changing account id: ${accountId}, with data: 
${JSON.stringify(accountData, null, 2)}
    `);
    let accountEntity = await this.getAccountById(accountId);
    accountEntity = {
      ...accountEntity,
      name: accountData.name,
      openDate: accountData.openDate,
      tags: [...accountData.tags],
    };
    accountEntity = await this.accountsRepository.changeAccount(accountEntity);
    const accountDTO = this.mapAccountToDTO(accountEntity);
    this.logger.verbose(`Account with id: ${accountId} is changed.`);
    this.logger.debug(`Account is changed: 
${JSON.stringify(accountDTO, null, 2)}
`);
    return accountDTO;
  }

  @Delete()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({})
  @HttpCode(204)
  async deleteAccount(@Query('account-id') accountId: number) {
    this.logger.verbose(`Deleting account id: ${accountId}.`);
    await this.getAccountById(accountId);
    await this.accountsRepository.deleteAccount(accountId);
  }

  private async getAccountById(accountId: number) {
    let accountEntity = await this.accountsRepository.getAccountById(accountId);
    if (accountEntity === undefined || accountEntity.id !== accountId) {
      const errorMessage = `No account exists with id: ${accountId}.`;
      this.logger.warn(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
    return accountEntity;
  }

  private mapAccountToDTO(accountEntry: AccountEntity): AccountDTO {
    return new AccountDTO({
      id: accountEntry.id,
      name: accountEntry.name,
      openDate: accountEntry.openDate,
      tags: [...accountEntry.tags],
      movementCount: accountEntry.movementCount,
      total: accountEntry.movementTotal,
    });
  }

  @Sse()
  accountChangeEvents(): Observable<string> {
    return of('');
  }
}
