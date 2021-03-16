import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('events_pkey', ['id'], { unique: true })
@Entity('events', { schema: 'public' })
export class Event {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  short: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column()
  price: number;

  @Column('datetime')
  date: Date;

  @Column()
  status: number;

  @Column('timestamp', {
    name: 'create_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
    comment: 'Creation date and time of the user',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_at',
    nullable: true,
    select: false,
    comment: 'Modification date and time of the user',
  })
  updateAt: Date | null;
}
