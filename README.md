# eojuk

![](https://img.shields.io/badge/language-Typescript-yellow) ![](https://img.shields.io/badge/version-0.4.4-brightgreen) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]()

어죽은 테이블 작성 쿼리를 ORM 코드들로 변환해주는 유용한 도구입니다.
기존 RAW Query를 마이그레이션하거나 ERD 도구에서 추출해낸 쿼리를 기반으로 엔티티 코드를 작성하기 좋습니다.

## 설치

설치는 npm을 이용해 간단하게 수행할 수 있습니다.

```
npm install -g eojuk
```

## 사용례

다음과 같은 쿼리 파일이 있을 경우

```
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
```

어죽을 사용하기만 하면 아래와 같이 테이블 코드를 자동으로 생성해줍니다.

```

import { literal } from 'sequelize';
import {
  Model,
  Table,
  Column,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  Sequelize,
  HasOne,
  DefaultScope,
  Scopes,
  Index,
  createIndexDecorator,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AllowNull,
  Default,
  Comment,
} from 'sequelize-typescript';
@Table({
    tableName: 'tb_user',
    paranoid: false,
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    // schema: 'cp',
})
export class tb_user extends Model {
    @Comment(`기본키`)
    @Column({
        primaryKey: true,
	autoIncrement: true,
	type: DataType.INTEGER,
        allowNull: false,
    })
    user_no: number;

    @Comment(`등록일시`)
    @Column({
        type: 'timestamptz',
        allowNull: false,
	default: litreal("current_timestamp"),
    })
    reg_date: Date;

    @Comment(``)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    foo: string;

    @Comment(`다 풀었는지`)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    complete_yn: boolean;
}
```

### 명령줄 옵션

-   -i --in: 입력파일들에 대한 경로입니다.
-   -dir --outdir: 파일을 출력할 경로입니다.
-   -db --database: 데이터베이스 형식입니다. 기본값은 postgresql입니다.
-   -o --orm: 출력할 ORM 형식입니다. 기본값은 sequelize-typescript입니다.

### 지원되는 입력형식

-   PostgreSQL
-   MySQL

### 지원되는 출력형식

-   sequelize (예정)
-   sequelize-typescript
-   typeorm

### 사용례

#####

mysql 쿼리를 typeorm 형식으로 내보내기

```
eojuk -i .\test\mysql\test1.sql -dir .\test\ -db mysql  -o typeorm
```

#####

postgresql 쿼리를 sequelize-typescript 형식으로 내보내기

```
eojuk -i .\test\pg\test1.sql -dir .\test\ -db pg  -o sequezlie-typescript
```
