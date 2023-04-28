import { IParser } from "../interfaces/parser";
import Table from "../types/table";
import {
  parseWithComments,
  parse as astParse,
  Statement,
  CreateTableStatement,
  CommentStatement,
  AlterTableStatement,
} from "pgsql-ast-parser";
import Column from "../types/column";

export class PostgreSQLParser implements IParser {
  constructor() {}

  // Auto Increment에 해당하는 타입인지 체크
  // postgres의 경우에는 시퀀스를 자동 생성해주는 타입
  private checkAutoIncrement(typename: string): boolean {
    return ["serial", "serial8", "bigserial"].includes(typename.toLowerCase());
  }

  // 데이터베이스 타입 일반화
  private normalizeDbType(typename: string): string {
    if (typename.toLowerCase() === "serial") {
      return "int";
    } else if (["serial8", "bigserial"].includes(typename.toLowerCase())) {
      return "int8";
    } else {
      return typename;
    }
  }

  // 데이터베이스의 컬럼타입을 타입스크립트 타입으로 변환
  private convertDbTypeToTsType(typename: string): string {
    if (["text", "varchar"].includes(typename.toLocaleLowerCase())) {
      return "string";
    } else if (["bool", "boolean"].includes(typename.toLocaleLowerCase())) {
      return "boolean";
    } else if (
      ["int", "int2", "int4", "int8", "bigint"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      return "number";
    } else if (
      ["timestamp", "timestamptz", "date"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      return "Date";
    } else if (typename[0] === "_") {
      return this.convertDbTypeToTsType(typename.slice(1)) + "[]";
    } else {
      return "string";
    }
  }

  private convertDbTypeToJavaType(typename: string): string {
    if (["text", "varchar"].includes(typename.toLocaleLowerCase())) {
      return "String";
    } else if (["bool", "boolean"].includes(typename.toLocaleLowerCase())) {
      return "Boolean";
    } else if (
      ["int", "int2", "int4", "int8", "bigint"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      switch (typename.toLocaleLowerCase()) {
        case "int":
        case "int2":
        case "int4":
          return "Integer";
        case "int8":
        case "bigint":
          return "Long";
      }
    } else if (
      ["timestamp", "timestamptz", "date"].includes(
        typename.toLocaleLowerCase()
      )
    ) {
      return "LocalDateTime";
    } else {
      return "string";
    }
  }

  // 파싱
  parse(sql: string): Table[] {
    const parsedList = astParse(sql);

    const tables: Table[] = [];

    for (const node of parsedList) {
      switch (node.type) {
        case "create table":
          tables.push(this.parseTable(node));
          break;
        case "comment":
          this.parseComment(node, tables);
          break;

        case "alter table":
          if ((node?.change as any)?.constraint?.type === "primary key") {
            this.parsePrimaryKey(node, tables);
          }
          break;

        default:
          console.log("예외 케이스");
          console.log(node);
          break;
      }
    }

    return tables;
  }

  // 테이블 구성 분석
  private parseTable(node: CreateTableStatement): Table {
    const table: Table = {
      tableName: node?.name?.name,
      columns: [],
    };

    for (const nodeOfTable of node.columns) {
      switch (nodeOfTable.kind) {
        case "column":
          const columnName = nodeOfTable?.name?.name;
          const dbType = (nodeOfTable?.dataType as any)?.name;
          const normalizedDbType = this.normalizeDbType(dbType);
          const isAutoIncrement = this.checkAutoIncrement(dbType);

          let isNotNull = false;
          let isPrimaryKey = false;
          let defaultValue = null;

          for (const nodeOfConstraints of nodeOfTable?.constraints) {
            switch (nodeOfConstraints.type) {
              case "not null":
                isNotNull = true;
                break;
              case "default":
                defaultValue = (nodeOfConstraints?.default as any)?.keyword;
            }
          }
          const column: Column = {
            name: columnName,
            dbType: normalizedDbType,
            tsType: this.convertDbTypeToTsType(normalizedDbType),
            javaType: this.convertDbTypeToJavaType(normalizedDbType),
            isNotNull,
            isPrimaryKey,
            default: defaultValue,
            isAutoIncrement,
            comment: "",
          };
          table.columns.push(column);
          break;
        default:
      }
    }

    return table;
  }

  // 코멘트 분석
  private parseComment(node: CommentStatement, tables: Table[]) {
    const commentContents = node?.comment;
    const commentTargetTableName = (node?.on as any)?.column?.table;
    const commentTargetColumnName = (node?.on as any)?.column?.column;
    const commenttargetColumn: Column = tables
      .find((e) => e.tableName === commentTargetTableName)
      ?.columns?.find((e) => e.name === commentTargetColumnName);

    if (commenttargetColumn) {
      commenttargetColumn.comment = commentContents;
    }
  }

  // 기본키 분석
  private parsePrimaryKey(node: AlterTableStatement, tables: Table[]) {
    const pkTargetColumnNames = (node?.change as any)?.constraint?.columns?.map(
      (e: any) => e?.name
    );
    const pkTargetTableName = node?.table?.name;

    // not use
    const _pkName = (node?.change as any)?.constraint?.constraintName?.name;

    tables
      .find((e) => e.tableName === pkTargetTableName)
      ?.columns?.forEach((e) => {
        if (pkTargetColumnNames.includes(e.name)) {
          e.isPrimaryKey = true;
        }
      });
  }
}
