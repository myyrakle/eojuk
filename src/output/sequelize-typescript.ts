import Column from "../types/column";
import { IOption } from "../types/option";
import { IEmmiter } from "../types/emitter";
import Source from "../types/source";
import Table from "../types/table";
import {
    convertNameCaseByOption,
    toCamelCase,
    toSnakeCase,
} from "../util.ts/name";
import { TAB } from "../util.ts/tab";

const importTemplate = `
import { literal } from 'sequelize';
import {
  Model,
  Table,
  Column,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  Sequelize,
  HasOne,
  DefaultScope,
  Scopes,
  Index,
  createIndexDecorator,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AllowNull,
  Default,
  Comment,
} from 'sequelize-typescript';
`;

export class SequelizeTypescriptEmitter implements IEmmiter {
    private option: IOption;

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
        const columnFieldName = convertNameCaseByOption(
            this.option.outputFieldNameCase,
            column.name
        );

        const primaryKey = column.isPrimaryKey
            ? `primaryKey: true, \n${TAB}${TAB}`
            : "";

        const autoIncrement = column.isAutoIncrement
            ? `autoIncrement: true, \n${TAB}${TAB}`
            : "";

        const defaultValue = column.default
            ? `\n${TAB}${TAB}default: literal("${column.default.replace(
                  '"',
                  '\\"'
              )}"),`
            : "";

        const dataType = this.dbTypeToDataType(column.dbType);

        return `    @Comment(\`${column.comment ?? ""}\`)
    @Column({
        ${primaryKey}${autoIncrement}field: '${columnFieldName}',
        type: ${dataType}, 
        allowNull: ${!column.isNotNull},${defaultValue}
    })
    ${columnFieldName}: ${column.tsType};`;
    }

    // 테이블 클래스 코드 생성
    private generateTableCode(table: Table) {
        const tableClassName = convertNameCaseByOption(
            this.option.outputClassNameCase,
            table.tableName
        );

        return `@Table({
    tableName: '${table.tableName}',
    paranoid: false,
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    // schema: 'cp',
})
export class ${tableClassName} extends Model {
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
