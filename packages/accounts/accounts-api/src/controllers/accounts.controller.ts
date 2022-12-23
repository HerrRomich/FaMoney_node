import { Query } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import  moment from "moment";
import { of } from "rxjs";
import { AccountDTO } from "../model";

@Controller({
    path: 'accounts'
})
export class AccountsController {

    @Get()
    getAllAccounts(@Query() tags: Set<string>) {
        const openDate = moment();
        const accountDTO: AccountDTO = {
            id: 1,
            name: 'Test account',
            tags: new Set([]),
            openDate,
            movementCount: 5,
            total: 0.0
        };
        return of([accountDTO]);
    }

}