import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Asset } from './Asset';
import { Point } from './Point';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  Fecha!: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  Usuario!: User;

  @ManyToOne(() => Asset, { eager: true })
  @JoinColumn()
  Activo!: Asset;

  @ManyToOne(() => Point, { eager: true, nullable: true })
  @JoinColumn()
  Punto?: Point;

  @Column({ nullable: true })
  Lubricante?: string;

  @Column({ type: 'float', nullable: true })
  CantidadAplicada?: number;

  @Column({ type: 'int', nullable: true })
  PulsosProgramados?: number;

  @Column({ type: 'int', nullable: true })
  PulsosAplicados?: number;

  @Column({ type: 'text', nullable: true })
  Observaciones?: string;

  @Column({ nullable: true })
  EvidenciaFotografica?: string;
}
