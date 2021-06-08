import Column from "./column";

// 테이블 타입
export default interface Table {
    tableName: string;
    columns: Column[];
}
