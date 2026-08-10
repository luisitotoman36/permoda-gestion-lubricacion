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

  @ManyToOne(() => Asset, { eager: true })
  @JoinColumn()
  AF!: Asset;

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

  @Column({ default: 'Abierta' })
  Estado!: string;
}
