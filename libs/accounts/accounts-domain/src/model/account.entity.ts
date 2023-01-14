export interface AccountEntity {
    id: number;
    name: string;
    openDate: Date;
    tags: string[];
    movementCount: number;
    movementTotal: number;
}