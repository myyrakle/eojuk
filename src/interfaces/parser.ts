import Table from "../types/table";

export interface IParser {
    parse(sql: string): Table[];
}
