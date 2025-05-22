import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluationRequestDto {
  @IsOptional()
  @IsString({ message: 'referenceCode debe ser un string.' })
  @ApiProperty({ description: 'Código de referencia de evaluación' })
  referenceCode?: string;
  @IsNotEmpty({ message: 'branchId es requerido.' })
  @IsNumber({}, { message: 'branchId debe ser un número.' })
  @ApiProperty({ description: 'ID de sucursal' })
  branchId: number;
  @IsNotEmpty({ message: 'branchName es requerido.' })
  @IsString({ message: 'branchName debe ser un string.' })
  @ApiProperty({ description: 'Nombre de sucursal' })
  branchName: string;
  @IsNotEmpty({ message: 'managerName es requerido.' })
  @IsString({ message: 'managerName debe ser un string.' })
  @ApiProperty({ description: 'Nombre de gerente de turno' })
  managerName: string;
  @IsNotEmpty({ message: 'evaluatorName es requerido.' })
  @IsString({ message: 'evaluatorName debe ser un string.' })
  @ApiProperty({ description: 'Nombre de evaluador' })
  evaluatorName: string;
  @IsNotEmpty({ message: 'username es requerido.' })
  @IsString({ message: 'username debe ser un string.' })
  @ApiProperty({ description: 'Nombre de usuario' })
  username: string;
  @IsOptional()
  @IsString({ message: 'comments debe ser un string.' })
  @ApiProperty({ description: 'Comentarios' })
  comments?: string;

  constructor(partial: Partial<EvaluationRequestDto>) {
    Object.assign(this, partial);
  }
}
