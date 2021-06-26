
import {Entity, PrimaryGeneratedColumn, Column, Generated} from "typeorm";
@Entity({
    name: 'tb_user',
    // database: '',
    // schema : true,
    synchronize : false,
})
export class tb_user {
    @PrimaryGeneratedColumn({
        type: 'INT', 
        nullable: false,
    })
    user_no: number;

    @Column({
        type: 'VARCHAR', 
        nullable: false,
    })
    nickname: string;

    @Column({
        type: 'VARCHAR', 
        nullable: false,
		default: "KOREAN",
		comment: "사용언어",
    })
    language: string;

    @Column({
        type: 'INT', 
        nullable: true,
    })
    correct_count: number;

    @Column({
        type: 'INT', 
        nullable: true,
    })
    wrong_count: number;

    @Column({
        type: 'VARCHAR', 
        nullable: true,
    })
    device_type: string;

    @Column({
        type: 'DATE', 
        nullable: false,
		default: "current_timestamp",
		comment: "등록일시",
    })
    reg_date: Date;

    @Column({
        type: 'TINYINT', 
        nullable: false,
    })
    complete_yn: number;
}