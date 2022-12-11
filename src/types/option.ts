import { NameCase } from "./name-case";

export interface IOption {
    sourceSplit?: boolean; //true면 테이블 스키마마다 소스 분리
    
    output?: "console" | "file";

    outputName?: string;
    inputFileNames?: string[];

    outputClassNameCase?: NameCase; // 출력할 클래스명을 어떤 케이스로 할지
    outputFieldNameCase?: NameCase; // 출력할 필드명을 어떤 케이스로 할지

    autoAddPrimaryKey?: string; // 기본으로 PrimayrKey 속성을 주입할지 여부. 그리고 그 컬럼명
    autoAddCreatedAt?: string; // 기본으로 CreatedAt 속성을 주입할지 여부. 그리고 그 컬럼명
    autoAddUpdatedAt?: string; // 기본으로 UpdatedAt 속성을 주입할지 여부. 그리고 그 컬럼명
    autoAddDeletedAt?: string; // 기본으로 DeletedAt 속성을 주입할지 여부. 그리고 그 컬럼명

    databaseName?: string; // 데이터베이스명
}
