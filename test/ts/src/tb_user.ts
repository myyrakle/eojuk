
import {Entity, PrimaryGeneratedColumn, Column, Generated} from "typeorm";

@Entity({
    name: 'tb_user',
    // database: '',
    // schema : true,
    synchronize : false,
})
export class tb_user {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    user_no: number;

    @Column({
        type: 'varchar',
    })
    nickname: string;

    @Column({
        type: 'varchar',
		nullable: false,
		default: "KOREAN",
		comment: "사용언어",
    })
    language: string;

    @Column({
        type: 'int',
    })
    correct_count: number;

    @Column({
        type: 'int',
    })
    wrong_count: number;

    @Column({
        type: 'varchar',
    })
    device_type: string;

    @Column({
        type: 'date',
		nullable: false,
		default: "current_timestamp",
		comment: "등록일시",
    })
    reg_date: Date;

    @Column({
        type: 'tinyint',
    })
    complete_yn: number;
}