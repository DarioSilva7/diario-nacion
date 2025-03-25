import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Contact } from '../contact/contact.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  street!: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value: string) => value?.trim().toUpperCase(),
      from: (value: string) => value,
    },
  })
  city!: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value: string) => value?.trim().toUpperCase(),
      from: (value: string) => value,
    },
  })
  state!: string;

  @OneToOne(() => Contact, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  contact!: Contact;
}
