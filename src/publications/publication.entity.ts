import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true, nullable: true })
  highlights: string[];

  @Column({ nullable: false })
  type: string;

  @Column('text', { array: true, nullable: true })
  jnr: string[];

  @Column({ nullable: false })
  title: string;

  @Column('text', { nullable: true })
  abstract: string;

  @Column('timestamp with time zone', { nullable: true })
  published_date: Date;

  @Column('date', { nullable: true })
  date: Date;

  @Column({ nullable: true })
  is_board_ruling: boolean;

  @Column({ nullable: true })
  is_brought_to_court: boolean;

  @Column({ nullable: true })
  authority: string;

  @Column('text', { nullable: false })
  body: string;
}
