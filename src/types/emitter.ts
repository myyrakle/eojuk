import IEmitOption from "./emit-option";
import Source from "./source";
import Table from "./table";

export default interface IEmmiter {
    emit(tables: Table[], option?: IEmitOption): Source[] | Promise<Source[]>;
}
