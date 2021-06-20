#! /usr/bin/env node

import { program } from "commander";
import { existsSync, readFileSync, writeFileSync } from "fs";
import PostgreSQLParser from "./input/postgres";
import SequelizeTypescriptEmitter from "./output/sequelize-typescript";

program.version("0.1.0");
program.option(
    "-db, --database <dbname>",
    "사용할 데이터베이스 형식을 결정합니다. 현재는 postgresql만 지원합니다.",
    "postgresql"
);
program.option(
    "-o, --orm <dbname>",
    "방출할 ORM 형식을 결정합니다.",
    "sequelize-typescript"
);
program.option("-i, --in <input...>", "읽어들일 입력파일들의 경로입니다.");
program.parse(process.argv);

const options = program.opts();

async function main() {
    if (!Array.isArray(options.in) || options?.length === 0) {
        console.log("!! 입력파일을 올바르게 지정해주세요.");
        return;
    }

    let query = ``;
    try {
        query = options?.in
            ?.map((path) => String(readFileSync(path)))
            .join("\n\n");
    } catch (error) {
        console.log("!! 파일 읽기 오류");
        console.error(error);
    }

    switch (options.database) {
        case "postgresql":
        case "pg":
            const parser = new PostgreSQLParser();
            const tables = parser.parse(query);

            switch (options.orm) {
                case "sequelize-typescript":
                case "st":
                    const emitter = new SequelizeTypescriptEmitter();
                    const sources = emitter.emit(tables);

                    for (const source of sources) {
                        const filename = existsSync(source.sourceName + ".ts")
                            ? source.sourceName + String(Date.now()) + ".ts"
                            : source.sourceName + ".ts";

                        writeFileSync(filename, source.source);
                        console.log(`## ${filename} 생성 완료`);
                    }

                    console.log("변환 성공");

                    break;
                case "sequelize":
                case "sq":
                    console.error("!! 아직 지원되지 않는 ORM입니다.");
                    break;
                case "typeorm":
                case "to":
                    console.error("!! 아직 지원되지 않는 ORM입니다.");
                    break;
            }
            break;

        case "mysql":
        case "my":
            console.error("!! 아직 지원되지 않는 데이터베이스입니다.");
            break;

        default:
            console.error("!! 아직 지원되지 않는 데이터베이스입니다.");
            break;
    }
}

main();
