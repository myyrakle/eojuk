import Table from "./table";

export interface IParser {
    parse(sql: string): Table[];
}
