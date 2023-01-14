import { ApiProperty } from "@nestjs/swagger";
import { Properties } from "..";

export class IdDTO {
    constructor(data: Properties<IdDTO>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    readonly id!: number
}