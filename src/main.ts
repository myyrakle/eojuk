import { program } from "commander";
import PostgreSQLParser from "./input/postgres";
import SequelizeTypescriptEmitter from "./output/sequelize-typescript";

const query = `
CREATE TABLE "tb_user" (
	"user_no"	serial8		NOT NULL,
	"reg_date"	timestamptz	DEFAULT CURRENT_TIMESTAMP	NOT NULL,
	"foo"	 varchar(100)	DEFAULT ''	NOT NULL,
	"complete_yn"	boolean	DEFAULT false	NOT NULL
);

COMMENT ON COLUMN "tb_user"."user_no" IS '기본키';

COMMENT ON COLUMN "tb_user"."nickname" IS '닉네임';

COMMENT ON COLUMN "tb_user"."user_uuid" IS 'UUID';

COMMENT ON COLUMN "tb_user"."language" IS '사용언어';

COMMENT ON COLUMN "tb_user"."correct_count" IS '맞춘 문제';

COMMENT ON COLUMN "tb_user"."wrong_count" IS '틀린 문제';

COMMENT ON COLUMN "tb_user"."device_type" IS 'PC인지 모바일인지';

COMMENT ON COLUMN "tb_user"."reg_date" IS '등록일시';

COMMENT ON COLUMN "tb_user"."complete_yn" IS '다 풀었는지';

ALTER TABLE "tb_user" ADD CONSTRAINT "PK_TB_USER" PRIMARY KEY (
	"user_no"
);
`;
//console.log("으악");

const parser = new PostgreSQLParser();
const tables = parser.parse(query);

//console.log(JSON.stringify(tables));

const emitter = new SequelizeTypescriptEmitter();
const result = emitter.emit(tables);

//console.log(result);

program.version("0.1.0");
program.option("-i --in", "input file path");
program.option("-o --out", "output file path");
program.parse(process.argv);
