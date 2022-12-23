import { AccountDataDTO } from "./account-data.dto";
import { IdDTO} from "@famoney/commons-api"

export type AccountDTO = Readonly<IdDTO & AccountDataDTO & {
    movementCount: number,
    total: number,
}>
