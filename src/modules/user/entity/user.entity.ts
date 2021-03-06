import {
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Index('users_pkey', ['id'], { unique: true })
@Index('users_identification_key', ['identification'], { unique: true })
@Index('users_email_key', ['email'], { unique: true })
@Entity('users', { schema: 'public' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    status: string;

    @Column()
    email: string;

    @Column('varchar', {
        name: 'identification',
        nullable: true, unique: true, length: 50,
        comment: 'Identity doc of the user'
    })
    identification: string | null;

    @Column()
    phone: string | null;

    @Column('text')
    address: string | null;

    @Column('timestamp', {
        name: 'create_at',
        default: () => 'CURRENT_TIMESTAMP',
        select: false,
        comment: 'Creation date and time of the user'
    })
    createAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'update_at',
        nullable: true,
        select: false,
        comment: 'Modification date and time of the user'
    })
    updateAt: Date | null;

}