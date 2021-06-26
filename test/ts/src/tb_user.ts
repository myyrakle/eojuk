
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
        allowNull: false,
    })
    user_no: number;

    @Column({
        type: 'VARCHAR', 
        allowNull: false,
    })
    nickname: string;

    @Column({
        type: 'VARCHAR', 
        allowNull: false,
		default: "KOREAN",
		comment: "사용언어",
    })
    language: string;

    @Column({
        type: 'INT', 
        allowNull: true,
    })
    correct_count: number;

    @Column({
        type: 'INT', 
        allowNull: true,
    })
    wrong_count: number;

    @Column({
        type: 'VARCHAR', 
        allowNull: true,
    })
    device_type: string;

    @Column({
        type: 'DATE', 
        allowNull: false,
		default: "current_timestamp",
		comment: "등록일시",
    })
    reg_date: Date;

    @Column({
        type: 'TINYINT', 
        allowNull: false,
    })
    complete_yn: number;
}