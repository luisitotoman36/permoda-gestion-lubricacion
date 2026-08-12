import { IsString, IsOptional, IsDateString, IsNumber, IsInt } from 'class-validator';

export class WorkOrderDto {
  @IsString()
  NumeroOT!: string;

  @IsOptional()
  @IsString()
  AF?: string;

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

  @IsOptional()
  @IsString()
  codigoMaquina?: string;

  @IsOptional()
  @IsString()
  maquina?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  tipoTrabajo?: string;

  @IsOptional()
  @IsString()
  prioridad?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  lubricante?: string;

  @IsOptional()
  @IsString()
  cantidad?: string;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsString()
  supervisor?: string;
}
