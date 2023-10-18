import Column from "../types/column";
import { IOption } from "../types/option";
import { IEmmiter } from "../interfaces/emitter";
import Source from "../types/source";
import Table from "../types/table";
import { convertNameCaseByOption } from "../util.ts/name";
import { TAB } from "../util.ts/tab";

export class MongeryEmitter implements IEmmiter {
  private option: IOption;

  private replaceType(type: string): string {
    switch (type.toLowerCase()) {
      case "time":
        return "time.Time";
      case "objectid":
        return "primitive.ObjectID";
      default:
        return type;
    }
  }

  // 컬럼 필드 코드 생성
  private generateColumn(column: Column) {
    let isPrimaryKey = false;

    column.dbType = this.replaceType(column.dbType);

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

    const omitEmpty = isPrimaryKey || !column.isNotNull ? `,omitempty` : "";

    const bsonTag = `\`bson:"${bsonName}${omitEmpty}"\``;

    const fieldType = column.isNotNull ? column.dbType : `*${column.dbType}`;

    return `${TAB}${fieldName} ${fieldType} ${bsonTag} // ${column.comment}`;
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
