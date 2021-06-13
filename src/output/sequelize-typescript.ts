import { table } from "console";
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from "constants";
import Column from "../types/column";
import IEmitOption from "../types/emit-option";
import IEmmiter from "../types/emitter";
import Source from "../types/source";
import Table from "../types/table";

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

export default class SequelizeTypescriptEmitter implements IEmmiter {
    // 컬럼 필드 코드 생성
    private generateColumn(column: Column) {
        const primaryKey = column.isPrimaryKey ? "primaryKey: true, \n\t" : "";
        const autoIncrement = column.isAutoIncrement
            ? "autoIncrement: true, \n\t"
            : "";
        const defaultValue = column.default
            ? `\n\tdefault: litreal("${column.default.replace('"', '\\"')}"),`
            : "";
        return `    @Comment(\`${column.comment}\`)
    @Column({
        ${primaryKey}${autoIncrement}type: ${column.dbType}, 
        allowNull: ${!column.isNotNull},${defaultValue}
    })
    ${column.name}: ${column.tsType};`;
    }

    // 테이블 클래스 코드 생성
    private generateTableCode(table: Table) {
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
export class ${table.tableName} extends Model {
${table.columns.map((column) => this.generateColumn(column)).join("\n\n")}
}`;
    }

    emit(tables: Table[], option?: IEmitOption): Source[] {
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
