import Table from "../types/table";
import { Parser } from "node-sql-parser";
import { IParser } from "../interfaces/parser";
import Column from "../types/column";

export class MySQLParser implements IParser {
  private mysqlAstParser = new Parser();

  constructor() {}

  parse(sql: string): Table[] {
    const ast: any = this.mysqlAstParser.astify(sql, {
      database: "mysql",
    });

    const tables: Table[] = [];

    for (const node of ast) {
      switch (node?.type) {
        case "create":
          switch (node?.keyword) {
            case "table":
              tables.push(this.parseTable(node));
              break;
          }
          break;
        default:
          break;
      }
    }

    return tables;
  }

  // 테이블 구성 분석
  private parseTable(node: any): Table {
    const table: Table = {
      tableName: node?.table?.[0]?.table,
      columns: [],
    };

    for (const nodeOfTable of node.create_definitions) {
      switch (nodeOfTable.resource) {
        case "column":
          const columnName = nodeOfTable?.column?.column;
          const dbType = nodeOfTable?.definition.dataType;
          const isAutoIncrement =
            nodeOfTable.auto_increment === "auto_increment";

          const isNotNull = nodeOfTable.nullable?.type === "not null";
          const isPrimaryKey = false; // ???
          const defaultValue = nodeOfTable.default_val?.value?.value ?? null;
          const comment = nodeOfTable.comment?.value?.value;

          const column: Column = {
            name: columnName,
            dbType,
            tsType: this.convertDbTypeToTsType(dbType),
            javaType: this.convertDbTypeToJavaType(dbType),
            pythonType: this.convertDbTypeToSQLAlchemyType(dbType),
            isNotNull,
            isPrimaryKey,
            default: defaultValue,
            isAutoIncrement,
            comment,
          };
          table.columns.push(column);
          break;

        case "constraint":
          switch (nodeOfTable.constraint_type) {
            case "primary key":
              table.columns.forEach((column) => {
                if (nodeOfTable?.definition?.includes(column.name)) {
                  column.isPrimaryKey = true;
                }
              });
              break;
            default:
          }
          break;
        default:
      }
    }

    return table;
  }

  // 데이터베이스의 컬럼타입을 타입스크립트 타입으로 변환
  private convertDbTypeToTsType(typename: string): string {
    if (
      [
        "tinyint",
        "smallint",
        "mediumint",
        "int",
        "bigint",
        "decimal",
        "float",
        "double",
      ].includes(typename.toLocaleLowerCase())
    ) {
      return "number";
    } else if (["bool", "boolean"].includes(typename.toLocaleLowerCase())) {
      return "boolean";
    } else if (
      [
        "char",
        "varchar",
        "tinytext",
        "text",
        "mediumtext",
        "longtext",
      ].includes(typename.toLocaleLowerCase())
    ) {
      return "string";
    } else if (
      ["date", "time", "datetime", "timestamp", "year"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      return "Date";
    } else {
      return "string";
    }
  }

  // 데이터베이스의 컬럼타입을 자바 타입으로 변환
  private convertDbTypeToJavaType(typename: string): string {
    if (
      ["tinyint", "smallint", "mediumint", "int", "bigint"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      switch (typename.toLocaleLowerCase()) {
        case "tinyint":
          return "Byte";
        case "smallint":
          return "Short";
        case "mediumint":
        case "int":
          return "Integer";
        case "bigint":
          return "Long";
      }
    } else if (
      ["decimal", "float", "double"].includes(typename.toLocaleLowerCase())
    ) {
      switch (typename.toLocaleLowerCase()) {
        case "decimal":
          return "BigDecimal";
        case "float":
          return "Float";
        case "double":
          return "Double";
      }
    } else if (["bool", "boolean"].includes(typename.toLocaleLowerCase())) {
      return "Boolean";
    } else if (
      [
        "char",
        "varchar",
        "tinytext",
        "text",
        "mediumtext",
        "longtext",
      ].includes(typename.toLocaleLowerCase())
    ) {
      return "String";
    } else if (
      ["date", "time", "datetime", "timestamp", "year"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      return "LocalDateTime";
    } else {
      return "String";
    }
  }

  // 데이터베이스의 컬럼타입을 파이썬 타입으로 변환
  public convertDbTypeToSQLAlchemyType(typename: string): string {
    if (
      ["tinyint", "smallint", "mediumint", "int", "bigint"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      switch (typename.toLocaleLowerCase()) {
        case "tinyint":
        case "smallint":
        case "mediumint":
        case "int":
          return "Integer";
        case "bigint":
          return "BigInteger";
      }
    } else if (
      ["decimal", "float", "double"].includes(typename.toLocaleLowerCase())
    ) {
      switch (typename.toLocaleLowerCase()) {
        case "decimal":
          return "BigDecimal";
        case "float":
          return "Float";
        case "double":
          return "Double";
      }
    } else if (["bool", "boolean"].includes(typename.toLocaleLowerCase())) {
      return "Boolean";
    } else if (
      [
        "char",
        "varchar",
        "tinytext",
        "text",
        "mediumtext",
        "longtext",
      ].includes(typename.toLocaleLowerCase())
    ) {
      return "String";
    } else if (
      ["date", "time", "datetime", "timestamp", "year"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      return "DateTime";
    } else {
      return "String";
    }
  }
}
