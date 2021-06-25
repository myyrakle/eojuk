import Column from "../types/column";
import { IEmmiter } from "../types/emitter";
import { IOption } from "../types/option";
import Source from "../types/source";
import Table from "../types/table";

const importTemplate = `
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
`;

export default class TypeOrmEmitter implements IEmmiter {
    private dbTypeToDataType(dbtype: string): string {
        if (["varchar", "text", "char"].includes(dbtype.toLowerCase())) {
            return "DataType.STRING";
        } else if (["bool", "boolean"].includes(dbtype.toLowerCase())) {
            return "DataType.BOOLEAN";
        } else if (["uuid"].includes(dbtype.toLowerCase())) {
            return "DataType.UUID";
        } else if (
            ["int", "int2", "int4", "int8", "bigint"].includes(
                dbtype.toLowerCase()
            )
        ) {
            return "DataType.INTEGER";
        } else {
            return `'${dbtype}'`;
        }
    }

    // 컬럼 필드 코드 생성
    private generateColumn(column: Column) {
        const primaryKey = column.isPrimaryKey ? "primaryKey: true, \n\t" : "";

        const autoIncrement = column.isAutoIncrement
            ? "autoIncrement: true, \n\t"
            : "";

        const defaultValue = column.default
            ? `\n\tdefault: literal("${column.default.replace('"', '\\"')}"),`
            : "";

        const dataType = this.dbTypeToDataType(column.dbType);

        return `    @Comment(\`${column.comment}\`)
    @Column({
        ${primaryKey}${autoIncrement}type: ${dataType}, 
        allowNull: ${!column.isNotNull},${defaultValue}
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
                source: importTemplate + this.generateTableCode(table),
            }));
        } else {
            return [
                {
                    sourceName: "all",
                    source:
                        importTemplate +
                        tables
                            .map((table) => this.generateTableCode(table))
                            .join("\n\n"),
                },
            ];
        }
    }
}
