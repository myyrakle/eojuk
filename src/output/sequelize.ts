import IEmmiter from "../types/emitter";
import Table from "../types/table";

export default class SequelizeEmitter implements IEmmiter {
    emit(tables: Table[]): string {
        return "";
    }
}
