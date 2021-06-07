// 각 컬럼 타입
export default interface Column {
    name: string;
    comment: string;
    db_type: string;
    js_type: string;
    is_not_null: string;
    is_pk: string;
}

export default interface Table {
    tableName: string;
    columns: Column[];
}
