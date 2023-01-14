import { ClassSerializerInterceptor } from "@nestjs/common";
import { Controller, UseInterceptors } from "@nestjs/common/decorators";

@Controller({
  path: 'movements',
})
@UseInterceptors(ClassSerializerInterceptor)
export class AccountMovementsController {}
