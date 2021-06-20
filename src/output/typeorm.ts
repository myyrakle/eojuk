import { IEmmiter } from "../types/emitter";
import Source from "../types/source";
import Table from "../types/table";

const importTemplate = `
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
`;

export default class TypeOrmEmitter implements IEmmiter {
    emit(tables: Table[]): Source[] {
        return [];
    }
}
