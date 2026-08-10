import { IsString, IsOptional, IsNumber, IsInt } from 'class-validator';

export class PointDto {
  @IsString()
  CodigoPunto!: string;

  @IsString()
  AF!: string; // AF id or value

  @IsOptional()
  @IsString()
  Descripcion?: string;

  @IsOptional()
  @IsString()
  Componente?: string;

  @IsOptional()
  @IsString()
  Rodamiento?: string;

  @IsOptional()
  @IsString()
  Lubricante?: string;

  @IsOptional()
  @IsNumber()
  CantidadGramos?: number;

  @IsOptional()
  @IsInt()
  PulsosRequeridos?: number;

  @IsOptional()
  @IsString()
  Frecuencia?: string;

  @IsOptional()
  @IsString()
  Estado?: string;

  @IsOptional()
  @IsString()
  Observaciones?: string;
}
