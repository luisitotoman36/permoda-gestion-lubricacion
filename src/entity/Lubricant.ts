import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Lubricant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  Codigo!: string;

  @Column()
  Nombre!: string;

  @Column({ nullable: true })
  Marca?: string;

  @Column({ nullable: true })
  Tipo?: string;

  @Column({ nullable: true })
  NLGI?: string;

  @Column({ nullable: true })
  ISO?: string;

  @Column({ nullable: true })
  Color?: string;

  @Column({ nullable: true })
  Fabricante?: string;

  @Column({ nullable: true })
  FichaTecnica?: string; // path to PDF

  @Column({ nullable: true })
  MSDS?: string; // path to PDF
}
