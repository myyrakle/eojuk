import IParser from "../types/parser";
import Table from "../types/table";

export default class PostgreSQLParser implements IParser {
    constructor() {}

    async parse(sql: string): Promise<Table[]> {
        return [];
    }
}
