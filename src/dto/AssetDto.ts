import { IsString, IsOptional } from 'class-validator';

export class AssetDto {
  @IsString()
  AF!: string;

  @IsString()
  NombreEquipo!: string;

  @IsString()
  TipoEquipo!: string;

  @IsOptional()
  @IsString()
  Marca?: string;

  @IsOptional()
  @IsString()
  Modelo?: string;

  @IsOptional()
  @IsString()
  Serie?: string;

  @IsString()
  Area!: string;

  @IsOptional()
  @IsString()
  SubArea?: string;

  @IsOptional()
  @IsString()
  Ubicacion?: string;

  @IsOptional()
  @IsString()
  CentroCosto?: string;

  @IsOptional()
  @IsString()
  Estado?: string;

  @IsOptional()
  @IsString()
  Criticidad?: string;

  @IsOptional()
  @IsString()
  Observaciones?: string;
}
