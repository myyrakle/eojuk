import IEmmiter from "../types/emitter";
import Table from "../types/table";

export default class TypeOrmEmitter implements IEmmiter {
    emit(tables: Table[]): string {
        return "";
    }
}
