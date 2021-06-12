import { table } from "console";
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from "constants";
import Column from "../types/column";
import IEmitOption from "../types/emit-option";
import IEmmiter from "../types/emitter";
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
    private generateColumn(column: Column) {
        const primaryKey = column.isPrimaryKey ? "primaryKey: true, " : "";
        const autoIncrement = column.isAutoIncrement
            ? "autoIncrement: true, "
            : "";
        return `    @Comment(\`${column.comment}\`)
    @Column({
        ${primaryKey}${autoIncrement}type: ${column.dbType}, 
        allowNull: ${!column.isNotNull},
    })
    ${column.name}: ${column.tsType};`;
    }

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

    emit(tables: Table[], option?: IEmitOption): string {
        return (
            importTemplate +
            tables.map((table) => this.generateTableCode(table)).join("\n\n")
        );
    }
}
