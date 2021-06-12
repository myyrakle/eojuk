import IEmitOption from "./emit-option";
import Table from "./table";

export default interface IEmmiter {
    emit(tables: Table[], option?: IEmitOption): string | Promise<string>;
}
