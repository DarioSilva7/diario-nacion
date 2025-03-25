import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Address } from '../address/address.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    transformer: {
      to: (value: string) => value.toUpperCase(),
      from: (value: string) => value,
    },
  })
  name!: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: false })
  profileImage!: string;

  @Column({ nullable: true, name: 'created_by' })
  createdby!: string;

  @Column({
    unique: true,
    type: 'text',
    transformer: {
      to: (value: string) => value?.trim().toLowerCase(),
      from: (value: string) => value,
    },
  })
  email!: string;

  @Column({ type: 'date' })
  birthdate!: string;

  @Column({
    name: 'phone_personal',
    type: 'text',
    transformer: {
      to: (value: string) => value.trim().replace(/[^\d]/g, ''),
      from: (value) => value,
    },
  })
  phonePersonal!: string;

  @Column({
    name: 'phone_work',
    nullable: true,
    type: 'text',
    transformer: {
      to: (value: string) => value?.trim().replace(/[^\d]/g, ''),
      from: (value) => value,
    },
  })
  phoneWork?: string;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deletedDate!: Date;

  @OneToOne(() => Address, (address) => address.contact, { eager: true })
  address!: Address;
}
