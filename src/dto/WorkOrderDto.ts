import { IsString, IsOptional, IsDateString, IsNumber, IsInt } from 'class-validator';

export class WorkOrderDto {
  @IsString()
  NumeroOT!: string;

  @IsString()
  AF!: string;

  @IsOptional()
  @IsString()
  PuntoLubricacion?: string;

  @IsOptional()
  @IsString()
  Tecnico?: string;

  @IsOptional()
  @IsDateString()
  FechaProgramada?: string;

  @IsOptional()
  @IsDateString()
  FechaEjecucion?: string;

  @IsOptional()
  @IsNumber()
  CantidadAplicada?: number;

  @IsOptional()
  @IsInt()
  PulsosAplicados?: number;

  @IsOptional()
  @IsString()
  Observaciones?: string;

  @IsOptional()
  @IsString()
  Estado?: string;
}
