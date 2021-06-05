const { Parser } = require("node-sql-parser");

const parser = new Parser();
const data = parser.parse(`
CREATE TABLE "tb_user" (
	"id"	int8		NOT NULL,
	"email"	varchar(200)		NOT NULL,
	"salt"	varchar(100)		NOT NULL,
	"password"	text		NOT NULL,
	"user_type"	varchar(10)	DEFAULT 'USER'	NOT NULL,
	"nickname"	varchar(30)		NOT NULL,
	"use_yn"	bool	DEFAULT true	NOT NULL,
	"reg_utc"	int8	DEFAULT floor(date_part('epoch'::text, now()))::bigint	NOT NULL
);
`);

console.log(data);
