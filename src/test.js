// const { Parser } = require("node-sql-parser");
// const mysqlParser = new Parser();
// const pgParser = require("pgsql-ast-parser");

// const psqlQuery = `
// CREATE TABLE "tb_user" (
// 	"id"	serial8		NOT NULL,
// 	"email"	varchar(200)		NOT NULL,
// 	"salt"	varchar(100)		NOT NULL,
// 	"password"	text		NOT NULL,
// 	"user_type"	varchar(10)	DEFAULT 'USER'	NOT NULL,
// 	"nickname"	varchar(30)		NOT NULL,
// 	"use_yn"	bool	DEFAULT true	NOT NULL,
// 	"reg_utc"	int8	DEFAULT floor(date_part('epoch'::text, now()))::bigint	NOT NULL
// );
// `;

// const ast = pgParser.parse(psqlQuery);

// //console.log(ast[0].columns[0]);

// const mysqlQuery = `CREATE TABLE \`test\` (
//     id int(11)  NOT NULL AUTO_INCREMENT,
//     name varchar(100) NOT NULL,
//     description longtext ,
//     image_url varchar(200)  DEFAULT NULL,
//     PRIMARY KEY (brand_id)
//   ) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8 COLLATE=utf8_bin`;

// console.log(mysqlParser.astify(mysqlQuery));
