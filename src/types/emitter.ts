import Table from "./table";

export default interface IEmmiter {
    emit(tables: Table[]): string | Promise<string>;
}
