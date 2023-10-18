import Column from "../types/column";
import { IOption } from "../types/option";
import { IEmmiter } from "../interfaces/emitter";
import Source from "../types/source";
import Table from "../types/table";
import { convertNameCaseByOption } from "../util.ts/name";
import { TAB } from "../util.ts/tab";

export class Mongery implements IEmmiter {
  private option: IOption;

  // 컬럼 필드 코드 생성
  private generateColumn(column: Column) {
    let isPrimaryKey = false;

    let fieldName = convertNameCaseByOption("PASCAL", column.name);

    if (column.name === "_id") {
      fieldName = "ID";
      isPrimaryKey = true;
    }

    const bsonName = convertNameCaseByOption("CAMEL", column.name);

    // PrimaryKey 강제 추가 옵션
    if (column.name == this.option.autoAddPrimaryKey) {
      column.isPrimaryKey = true;
    }

    const omitEmpty = isPrimaryKey ? `,omitempty` : "";

    const bsonTag = `\`bson:"${bsonName}${omitEmpty}"\``;

    return `${TAB}${fieldName} ${column.dbType} ${bsonTag} // ${column.comment}`;
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
        source: this.generateTableCode(table),
      }));
    } else {
      return [
        {
          sourceName: "all",
          source: tables
            .map((table) => this.generateTableCode(table))
            .join("\n\n"),
        },
      ];
    }
  }
}
