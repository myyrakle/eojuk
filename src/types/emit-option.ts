export default interface IEmitOption {
    sourceSplit?: boolean; //true면 테이블 스키마마다 소스 분리
    output?: "console" | "file";
}
