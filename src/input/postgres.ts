import IParser from "../types/parser";
import Table from "../types/table";
import { parseWithComments } from "pgsql-ast-parser";

export default class PostgreSQLParser implements IParser {
    constructor() {}

    parse(sql: string): Table[] {
        return [];
    }
}
