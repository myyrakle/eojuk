import Column from "../types/column";
import { IEmmiter } from "../types/emitter";
import { IOption } from "../types/option";
import Source from "../types/source";
import Table from "../types/table";

const importTemplate = `
import {Entity, PrimaryGeneratedColumn, Column, Generated} from "typeorm";
`;

export class TypeOrmEmitter implements IEmmiter {
    // 컬럼 필드 코드 생성
    private generateColumn(column: Column) {
        let defaultValue = column.default
            ? `\n\t\tdefault: "${column.default.replace('"', '\\"')}",`
            : "";

        let comment = column.default
            ? `\n\t\tcomment: "${column.comment.replace('"', '\\"')}",`
            : "";

        let nullable = column.default
            ? `\n\t\tnullable: ${!column.isNotNull},`
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
        type: '${column.dbType.toLowerCase()}',${nullable}${defaultValue}${comment}
    })
    ${column.name}: ${column.tsType};`;
    }

    // 테이블 클래스 코드 생성
    private generateTableCode(table: Table) {
        return `@Entity({
    name: '${table.tableName}',
    // database: '',
    // schema : true,
    synchronize : false,
})
export class ${table.tableName} {
${table.columns.map((column) => this.generateColumn(column)).join("\n\n")}
}`;
    }

    emit(tables: Table[], option: IOption = { sourceSplit: true }): Source[] {
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
