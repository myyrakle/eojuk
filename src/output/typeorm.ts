import IEmmiter from "../types/emitter";
import Source from "../types/source";
import Table from "../types/table";

export default class TypeOrmEmitter implements IEmmiter {
    emit(tables: Table[]): Source[] {
        return [];
    }
}
