import Column from "../types/column";
import { IOption } from "../types/option";
import { IEmmiter } from "../interfaces/emitter";
import Source from "../types/source";
import Table from "../types/table";
import { convertNameCaseByOption } from "../util.ts/name";
import { TAB } from "../util.ts/tab";
import { escapeDoubleQuote } from "../util.ts/escape";

const importTemplate = `// If under EE 9, change jakarta to javax
import jakarta.annotation.*;
import jakarta.persistence.*;
import jakarta.persistence.Table;

import org.hibernate.annotations.*;
import java.time.LocalDateTime;
`;

export class Mongery implements IEmmiter {
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

    const primaryKey = column.isPrimaryKey ? `\n${TAB}@Id` : "";

    const autoIncrement = column.isAutoIncrement
      ? `\n${TAB}@GeneratedValue(strategy = GenerationType.IDENTITY)`
      : "";

    const defaultValue = column.default
      ? `\n${TAB}@ColumnDefault("${escapeDoubleQuote(column.default)}")`
      : "";

    const comment = column.comment
      ? `\n${TAB}@Comment("${escapeDoubleQuote(column.comment)}")`
      : "";

    //const dataType = this.dbTypeToDataType(column.dbType);

    const columnAnnotation = `\n${TAB}@Column(name = "${escapeDoubleQuote(
      column.name
    )}")`;

    const notNullAnnotaion = column.isNotNull
      ? `\n${TAB}@Nonnull`
      : `\n${TAB}@Nullable`;

    return `${primaryKey}${autoIncrement}${columnAnnotation}${notNullAnnotaion}${comment}${defaultValue}${createdAt}${updatedAt}${deletedAt}
${TAB}${column.javaType} ${columnFieldName};`;
  }

  // 테이블 클래스 코드 생성
  private generateTableCode(table: Table) {
    const tableClassName = convertNameCaseByOption("PASCAL", table.tableName);

    return `// ${tableClassName}
// @Entity
type ${tableClassName} struct {
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
