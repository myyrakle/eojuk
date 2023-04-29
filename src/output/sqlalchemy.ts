import Column from "../types/column";
import { IOption } from "../types/option";
import { IEmmiter } from "../interfaces/emitter";
import Source from "../types/source";
import Table from "../types/table";
import { convertNameCaseByOption } from "../util.ts/name";
import { TAB } from "../util.ts/tab";
import { escapeDoubleQuote } from "../util.ts/escape";

const importTemplate = `
from sqlalchemy import Column
from sqlalchemy import String, Integer, Double, Float, BigInt, DateTime, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()
`;

export class SQLAlchemyEmitter implements IEmmiter {
  private option: IOption;

  // 컬럼 필드 코드 생성
  private generateColumn(column: Column) {
    const columnFieldName = convertNameCaseByOption(
      this.option.outputFieldNameCase,
      column.name
    );

    // PrimaryKey 강제 추가 옵션
    if (column.name == this.option.autoAddPrimaryKey) {
      column.isPrimaryKey = true;
    }

    const primaryKey = column.isPrimaryKey ? `, primary_key=True` : "";

    const autoIncrement = column.isAutoIncrement ? `, autoincrement=True` : "";

    const defaultValue = column.default
      ? `, default="${escapeDoubleQuote(column.default)}"`
      : "";

    const comment = column.comment
      ? `, comment="${escapeDoubleQuote(column.comment)}"`
      : "";

    const notNull = column.isNotNull ? `, nullable=False` : `, nullable=True`;

    const type = column.pythonType;

    return `${TAB}${columnFieldName} = Column(${type}${primaryKey}${autoIncrement}${notNull}${defaultValue}${comment})`;
  }

  // 테이블 클래스 코드 생성
  private generateTableCode(table: Table) {
    const hasDatabaseName = this.option.databaseName != null;

    const tableClassName = convertNameCaseByOption(
      this.option.outputClassNameCase,
      table.tableName
    );

    return `class ${tableClassName}(Base):
${TAB}__tablename__ = "${table.tableName}"

${table.columns.map((column) => this.generateColumn(column)).join("\n")}
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
            tables.map((table) => this.generateTableCode(table)).join("\n\n"),
        },
      ];
    }
  }
}
