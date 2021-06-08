import Table from "./table";

export default interface IParser {
    parse(sql: string): Table[] | Promise<Table[]>;
}
