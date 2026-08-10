import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;

  @Column()
  usuario!: string;

  @Column()
  accion!: string;

  @Column({ type: 'text', nullable: true })
  detalle?: string;
}
