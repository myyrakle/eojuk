#! /usr/bin/env node

import { program } from "commander";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { PostgreSQLParser } from "./input/postgres";
import { SequelizeTypescriptEmitter } from "./output/sequelize-typescript";
import { IEmmiter } from "./interfaces/emitter";
import { IParser } from "./interfaces/parser";
import { join } from "path";
import { MySQLParser } from "./input/mysql";
import { TypeOrmEmitter } from "./output/typeorm";
import { IOption } from "./types/option";
import { NAME_CASE_LIST } from "./types/name-case";
import { JPAEmitter } from "./output/jpa-java";

export {
  IEmmiter,
  TypeOrmEmitter,
  SequelizeTypescriptEmitter,
  IParser,
  MySQLParser,
  PostgreSQLParser,
};

program.version("0.3.1");
program.option(
  "-db, --database <dbname>",
  "사용할 데이터베이스 형식을 결정합니다. pg(postgresql)와 my(mysql)가 지원됩니다.",
  "postgresql"
);
program.option(
  "-o, --orm <dbname>",
  "방출할 ORM 형식을 결정합니다. st(sequelize-typescript). ty(typeorm) 2가지가 지원됩니다.",
  "sequelize-typescript"
);
program.option("-i, --in <input...>", "읽어들일 입력파일들의 경로입니다.");
program.option("-dir, --outdir <outdir>", "파일을 출력할 디렉토리 경로입니다.");
program.option(
  "-cn, --classname <case>",
  "클래스명을 어떤 케이스로 할지 정합니다. ex) PASCAL, NONE. 기본값 PASCAL",
  "PASCAL"
);
program.option(
  "-fn, --fieldname <case>",
  "클래스의 필드명을 어떤 케이스로 할지 정합니다. ex) CAMEL, SNAKE, NONE, 기본값 CAMEL",
  "CAMEL"
);
program.option(
  "-pk, --primarykey <column_name>",
  "기본키를 무엇으로 설정할 것인지 정합니다. ex) id",
  "id"
);
program.option(
  "-ca, --createdat <column_name>",
  "무슨 컬럼을 CreatedAt 컬럼으로 설정할 것인지 정합니다. ex) created_at",
  "created_at"
);
program.option(
  "-ua, --updatedat <column_name>",
  "무슨 컬럼을 UpdatedAt 컬럼으로 설정할 것인지 정합니다. ex) updated_at",
  "updated_at"
);
program.option(
  "-da, --deletedat <column_name>",
  "무슨 컬럼을 DeletedAt 컬럼으로 설정할 것인지 정합니다. ex) deleted_at",
  "deleted_at"
);
program.option(
  "-s, --schema <schema_name>",
  "스키마 명을 정합니다. ex) public"
);
program.parse(process.argv);

const options = program.opts();

const outDir = options.outdir ?? "";

async function main() {
  if (!Array.isArray(options.in) || options?.length === 0) {
    console.log("!! 입력파일을 올바르게 지정해주세요.");
    return;
  }

  let query = ``;
  try {
    query = options?.in?.map((path) => String(readFileSync(path))).join("\n\n");
  } catch (error) {
    console.log("!! 파일 읽기 오류");
    console.error(error);
  }

  let parser: IParser = null;
  let emitter: IEmmiter = null;

  const emitOption: IOption = {
    sourceSplit: true,
    outputClassNameCase: "PASCAL",
    outputFieldNameCase: "CAMEL",
    autoAddPrimaryKey: options.primarykey,
    autoAddCreatedAt: options.createdat,
    autoAddUpdatedAt: options.updatedat,
    autoAddDeletedAt: options.deletedat,
    databaseName: options.schema,
  };

  if (NAME_CASE_LIST.includes((options?.classname as string)?.toUpperCase())) {
    emitOption.outputClassNameCase = options.classname;
  }

  if (NAME_CASE_LIST.includes((options?.fieldname as string)?.toUpperCase())) {
    emitOption.outputFieldNameCase = options.fieldname;
  }

  switch (options.database) {
    case "postgresql":
    case "postgres":
    case "postgre":
    case "pg":
      parser = new PostgreSQLParser();
      break;

    case "mysql":
    case "my":
      parser = new MySQLParser();
      break;

    case "mssql":
    case "ms":
      console.error("!! 지원되지 않는 데이터베이스입니다.");
      break;

    case "oracle":
      console.error("!! 지원되지 않는 데이터베이스입니다.");
      break;

    case "sqlite":
      console.error("!! 지원되지 않는 데이터베이스입니다.");
      break;

    case "mariadb":
    case "maria":
      console.error("!! 지원되지 않는 데이터베이스입니다.");
      break;

    default:
      console.error("!! 지원되지 않는 데이터베이스입니다.");
      return;
  }

  let file_extension = "";

  switch (options.orm) {
    case "sequelize-typescript":
    case "st":
      emitter = new SequelizeTypescriptEmitter();
      file_extension = ".ts";
      break;
    case "sequelize":
    case "sq":
      console.error("!! 아직 지원되지 않는 ORM입니다.");
      file_extension = ".js";
      break;
    case "typeorm":
    case "ty":
      emitter = new TypeOrmEmitter();
      file_extension = ".ts";
      break;
    case "jpa":
      emitter = new JPAEmitter();
      file_extension = ".java";
      break;
    default:
      console.error("!! 지원되지 않는 ORM입니다.");
      return;
  }

  const tables = parser.parse(query);
  const sources = emitter.emit(tables, emitOption);

  for (const source of sources) {
    const filename = existsSync(
      join(outDir, source.sourceName) + file_extension
    )
      ? join(outDir, source.sourceName) + String(Date.now()) + file_extension
      : join(outDir, source.sourceName) + file_extension;

    writeFileSync(filename, source.source);
    console.log(`## ${filename} 생성 완료`);
  }

  console.log("$$ 변환 성공");
}

main();
