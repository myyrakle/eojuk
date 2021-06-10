import IParser from "../types/parser";
import Table from "../types/table";
import { parseWithComments, parse } from "pgsql-ast-parser";
import Column from "../types/column";

export default class PostgreSQLParser implements IParser {
    constructor() {}

    private checkAutoIncrement(typename: string): boolean {
        return ["serial", "serial8", "bigserial"].includes(
            typename.toLowerCase()
        );
    }

    private normalizeDbType(typename: string): string {
        if (typename.toLowerCase() === "serial") {
            return "int";
        } else if (["serial8", "bigserial"].includes(typename.toLowerCase())) {
            return "int8";
        } else {
            return typename;
        }
    }

    private convertDbTypeToTsType(typename: string): string {
        if (["text", "varchar"].includes(typename.toLocaleLowerCase())) {
            return "string";
        } else if (["bool", "boolean"].includes(typename.toLocaleLowerCase())) {
            return "boolean";
        } else if (
            ["int", "int2", "int4", "int8", "bigint"].includes(
                typename.toLocaleLowerCase()
            )
        ) {
            return "number";
        } else if (
            ["timestamp", "timestamptz", "date"].includes(
                typename.toLocaleLowerCase()
            )
        ) {
            return "Date";
        } else if (typename[0] === "_") {
            return this.convertDbTypeToTsType(typename.slice(1)) + "[]";
        } else {
            return "string";
        }
    }

    parse(sql: string): Table[] {
        const parsedList = parse(sql);

        const tables: Table[] = [];

        for (const node of parsedList) {
            switch (node.type) {
                case "create table":
                    const table: Table = {
                        tableName: node?.name?.name,
                        columns: [],
                    };

                    for (const nodeOfTable of node.columns) {
                        switch (nodeOfTable.kind) {
                            case "column":
                                const columnName = nodeOfTable?.name?.name;
                                const dbType = (nodeOfTable?.dataType as any)
                                    ?.name;
                                const normalizedDbType =
                                    this.normalizeDbType(dbType);
                                const isAutoIncrement =
                                    this.checkAutoIncrement(dbType);

                                let isNotNull = false;
                                let isPrimaryKey = false;
                                let defaultValue = null;

                                for (const nodeOfConstraints of nodeOfTable?.constraints) {
                                    switch (nodeOfConstraints.type) {
                                        case "not null":
                                            isNotNull = true;
                                            break;
                                        case "default":
                                            defaultValue = (
                                                nodeOfConstraints?.default as any
                                            )?.keyword;
                                    }
                                    console.log(nodeOfConstraints);
                                }
                                const column: Column = {
                                    name: nodeOfTable?.name?.name,
                                    dbType: normalizedDbType,
                                    tsType: this.convertDbTypeToTsType(
                                        normalizedDbType
                                    ),
                                    isNotNull,
                                    isPrimaryKey,
                                    default: defaultValue,
                                    isAutoIncrement,
                                };
                                table.columns.push(column);
                                break;
                            default:
                            //console.log()
                        }
                    }

                    tables.push(table);
                    break;
                case "comment":
                    break;
            }
        }

        return [];
    }
}
