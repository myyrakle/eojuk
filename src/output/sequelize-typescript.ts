import Column from "../types/column";
import { IOption } from "../types/option";
import { IEmmiter } from "../interfaces/emitter";
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

        const hasCreatedAt = column.name == this.option.autoAddCreatedAt
        const hasUpdatedAt = column.name == this.option.autoAddUpdatedAt
        const hasDeletedAt = column.name == this.option.autoAddDeletedAt

        // PrimaryKey 강제 추가 옵션
        if(column.name == this.option.autoAddPrimaryKey) {
            column.isPrimaryKey = true;
        }

        const createdAt = hasCreatedAt ? `\n${TAB}@CreatedAt` : "";
        const updatedAt = hasUpdatedAt ? `\n${TAB}@UpdatedAt` : "";
        const deletedAt = hasDeletedAt ? `\n${TAB}@DeletedAt` : "";

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

        return `    @Comment(\`${column.comment ?? ""}\`)${createdAt}${updatedAt}${deletedAt}
    @Column({
        ${primaryKey}${autoIncrement}field: '${column.name}',
        type: ${dataType}, 
        allowNull: ${!column.isNotNull},${defaultValue}
    })
    ${columnFieldName}: ${column.tsType};`;
    }

    // 테이블 클래스 코드 생성
    private generateTableCode(table: Table) {
        const hasCreatedAt = table.columns.find(e=>e.name == this.option.autoAddCreatedAt) != null;
        const hasUpdatedAt = table.columns.find(e=>e.name == this.option.autoAddUpdatedAt) != null;
        const hasDeletedAt = table.columns.find(e=>e.name == this.option.autoAddDeletedAt) != null;

        const tableClassName = convertNameCaseByOption(
            this.option.outputClassNameCase,
            table.tableName
        );

        return `@Table({
    tableName: '${table.tableName}',
    paranoid: ${hasDeletedAt},
    freezeTableName: true,
    timestamps: ${hasCreatedAt || hasCreatedAt || hasDeletedAt},
    createdAt: ${hasCreatedAt},
    updatedAt: ${hasUpdatedAt},
    deletedAt: ${hasDeletedAt},
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
