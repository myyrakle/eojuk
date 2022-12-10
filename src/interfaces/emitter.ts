import { IOption } from "../types/option";
import Source from "../types/source";
import Table from "../types/table";

export interface IEmmiter {
    emit(tables: Table[], option?: IOption): Source[];
}
