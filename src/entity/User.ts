import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  fullName!: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn()
  role!: Role;

  @Column({ default: true })
  active!: boolean;
}
