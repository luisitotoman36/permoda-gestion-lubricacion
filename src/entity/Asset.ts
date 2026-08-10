import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  AF!: string;

  @Column()
  NombreEquipo!: string;

  @Column()
  TipoEquipo!: string;

  @Column({ nullable: true })
  Marca!: string;

  @Column({ nullable: true })
  Modelo!: string;

  @Column({ nullable: true })
  Serie!: string;

  @Column()
  Area!: string;

  @Column({ nullable: true })
  SubArea!: string;

  @Column({ nullable: true })
  Ubicacion!: string;

  @Column({ nullable: true })
  CentroCosto!: string;

  @Column({ default: 'Operativo' })
  Estado!: string;

  @Column({ default: 'Baja' })
  Criticidad!: string;

  @Column({ type: 'text', nullable: true })
  Observaciones?: string;
}
