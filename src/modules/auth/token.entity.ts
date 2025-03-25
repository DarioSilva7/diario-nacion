import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  token!: string;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  user!: User;
}
