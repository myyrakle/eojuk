import Column from "../types/column";
import { IEmmiter } from "../interfaces/emitter";
import { IOption } from "../types/option";
import Source from "../types/source";
import Table from "../types/table";
import {
    convertNameCaseByOption,
    toCamelCase,
    toPascalCase,
    toSnakeCase,
} from "../util.ts/name";
import { TAB } from "../util.ts/tab";

const importTemplate = `
import {Entity, PrimaryGeneratedColumn, Column, Generated} from "typeorm";
`;

export class TypeOrmEmitter implements IEmmiter {
    private option: IOption;

    // 컬럼 필드 코드 생성
    private generateColumn(column: Column) {
        const columnFieldName = convertNameCaseByOption(
            this.option.outputFieldNameCase,
            column.name
        );

        let defaultValue = column.default
            ? `\n${TAB}${TAB}default: "${column.default?.replace('"', '\\"')}",`
            : "";

        let comment = column.default
            ? `\n${TAB}${TAB}comment: "${
                  column.comment?.replace('"', '\\"') ?? ""
              }",`
            : "";

        let nullable = column.default
            ? `\n${TAB}${TAB}nullable: ${!column.isNotNull},`
            : "";

        let columnDecorator = "Column";

        if (column.isPrimaryKey && column.isAutoIncrement) {
            columnDecorator = "PrimaryGeneratedColumn";
            defaultValue = "";
            nullable = "";
        } else if (column.isPrimaryKey) {
            columnDecorator = "PrimaryColumn";
            nullable = "";
        } else if (column.isAutoIncrement) {
            columnDecorator = "Generated";
            defaultValue = "";
        }

        return `    @${columnDecorator}({
        name: '${column.name}',
        type: '${column.dbType.toLowerCase()}',${nullable}${defaultValue}${comment}
    })
    ${columnFieldName}: ${column.tsType};`;
    }

    // 테이블 클래스 코드 생성
    private generateTableCode(table: Table) {
        const tableClassName = convertNameCaseByOption(
            this.option.outputClassNameCase,
            table.tableName
        );

        return `@Entity({
    name: '${table.tableName}',
    // database: '',
    // schema : true,
    synchronize : false,
})
export class ${tableClassName} {
${table.columns.map((column) => this.generateColumn(column)).join("\n\n")}
}`;
    }

    emit(
        tables: Table[],
        option: IOption = {
            sourceSplit: true,
            outputClassNameCase: "PASCAL",
            outputFieldNameCase: "CAMEL",
        }
    ): Source[] {
        this.option = option;

        if (option?.sourceSplit) {
            return tables.map((table) => ({
                sourceName: table.tableName,
                source: importTemplate + "\n" + this.generateTableCode(table),
            }));
        } else {
            return [
                {
                    sourceName: "all",
                    source:
                        importTemplate +
                        "\n" +
                        tables
                            .map((table) => this.generateTableCode(table))
                            .join("\n\n"),
                },
            ];
        }
    }
}
