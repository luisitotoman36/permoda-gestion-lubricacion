import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './Asset';

@Entity()
export class Point {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Asset, { eager: true })
  @JoinColumn()
  asset!: Asset; // AF relation

  @Column({ unique: true })
  CodigoPunto!: string;

  @Column({ type: 'text', nullable: true })
  Descripcion?: string;

  @Column({ nullable: true })
  Componente?: string;

  @Column({ nullable: true })
  Rodamiento?: string;

  @Column({ nullable: true })
  Lubricante?: string;

  @Column({ type: 'float', default: 0 })
  CantidadGramos!: number;

  @Column({ type: 'int', default: 0 })
  PulsosRequeridos!: number;

  @Column({ nullable: true })
  Frecuencia?: string;

  @Column({ nullable: true })
  FechaUltimaLubricacion?: Date;

  @Column({ nullable: true })
  FechaProximaLubricacion?: Date;

  @Column({ default: 'Activo' })
  Estado!: string;

  @Column({ type: 'text', nullable: true })
  Observaciones?: string;
}
