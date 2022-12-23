import { Moment } from "moment"

export type AccountDataDTO = Readonly<{
    name: string,
    openDate: Moment,
    tags: ReadonlySet<string>
}>