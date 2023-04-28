// 각 컬럼 타입
export default interface Column {
    name: string; // 컬럼명
    dbType: string; // 실제 데이터베이스 타입
    tsType: string; // 매핑할 코드 타입 (TypeScript)
    javaType: string; // 매핑할 코드 타입 (Java, Kotlin)
    isNotNull: boolean; // Not Null 여부
    isPrimaryKey: boolean; // 기본키 여부
    default?: string; // 디폴트값
    comment?: string; // 코멘트
    isAutoIncrement?: boolean; // 자동 증가 컬럼 여부
}
