import { IsString, IsOptional } from 'class-validator';

export class LubricantDto {
  @IsString()
  Codigo!: string;

  @IsString()
  Nombre!: string;

  @IsOptional()
  @IsString()
  Marca?: string;

  @IsOptional()
  @IsString()
  Tipo?: string;

  @IsOptional()
  @IsString()
  NLGI?: string;

  @IsOptional()
  @IsString()
  ISO?: string;

  @IsOptional()
  @IsString()
  Color?: string;

  @IsOptional()
  @IsString()
  Fabricante?: string;

  @IsOptional()
  @IsString()
  FichaTecnica?: string;

  @IsOptional()
  @IsString()
  MSDS?: string;
}
