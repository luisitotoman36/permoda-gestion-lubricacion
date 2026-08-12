import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './Asset';
import { Point } from './Point';
import { User } from './User';

@Entity()
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  NumeroOT!: string;

  @ManyToOne(() => Asset, { eager: true, nullable: true })
  @JoinColumn()
  AF?: Asset | null;

  @ManyToOne(() => Point, { eager: true, nullable: true })
  @JoinColumn()
  PuntoLubricacion?: Point;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn()
  Tecnico?: User;

  @Column({ nullable: true })
  FechaProgramada?: Date;

  @Column({ nullable: true })
  FechaEjecucion?: Date;

  @Column({ type: 'float', nullable: true })
  CantidadAplicada?: number;

  @Column({ type: 'int', nullable: true })
  PulsosAplicados?: number;

  @Column({ type: 'text', nullable: true })
  Observaciones?: string;

  @Column({ type: 'text', nullable: true })
  Fotografias?: string; // path(s)

  @Column({ default: 'Pendiente' })
  Estado!: string;

  @Column({ nullable: true })
  codigoMaquina?: string;

  @Column({ nullable: true })
  maquina?: string;

  @Column({ nullable: true })
  ubicacion?: string;

  @Column({ nullable: true })
  area?: string;

  @Column({ nullable: true })
  tipoTrabajo?: string;

  @Column({ nullable: true })
  prioridad?: string;

  @Column({ nullable: true })
  responsable?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  lubricante?: string;

  @Column({ nullable: true })
  cantidad?: string;

  @Column({ nullable: true })
  unidad?: string;

  @Column({ nullable: true })
  supervisor?: string;
}
