CREATE TABLE `tb_user` (
	`user_no`	int	NOT NULL AUTO_INCREMENT	COMMENT '기본키',
	`nickname`	varchar(50)	NOT NULL	COMMENT '닉네임',
	`language`	varchar(50)	NOT NULL	DEFAULT 'KOREAN'	COMMENT '사용언어',
	`correct_count`	int4	NULL	COMMENT '맞춘 문제',
	`wrong_count`	int4	NULL	COMMENT '틀린 문제',
	`device_type`	varchar(50)	NULL	COMMENT 'PC인지 모바일인지',
	`reg_date`	date	NOT NULL	DEFAULT NOT()	COMMENT '등록일시',
	`complete_yn`	boolean	NOT NULL	DEFAULT false	COMMENT '다 풀었는지'
);