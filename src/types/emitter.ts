import { IOption } from "./option";
import Source from "./source";
import Table from "./table";

export interface IEmmiter {
    emit(tables: Table[], option?: IOption): Source[];
}
