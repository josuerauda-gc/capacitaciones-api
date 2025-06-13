import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluationRequestDto {
  @IsOptional()
  @IsString({
    message: 'El código de referencia debe ser una cadena de texto.',
  })
  @ApiProperty({ description: 'El código de referencia de evaluación' })
  referenceCode?: string;
  @IsNotEmpty({ message: 'La sucursal es requerida.' })
  @IsNumber({}, { message: 'No se envió el ID de sucursal.' })
  @ApiProperty({ description: 'ID de sucursal' })
  branchId: number;
  @IsNotEmpty({ message: 'La sucursal es requerida.' })
  @IsString({ message: 'La sucursal debe ser una cadena de texto.' })
  @ApiProperty({ description: 'Nombre de sucursal' })
  branchName: string;
  @IsOptional()
  @IsString({ message: 'El nombre gerente debe ser una cadena de texto.' })
  @ApiProperty({ description: 'Nombre de gerente de turno' })
  managerName?: string;
  @IsNotEmpty({ message: 'El evaluador es requerido.' })
  @IsString({ message: 'El evaluador debe ser una cadena de texto.' })
  @ApiProperty({ description: 'Nombre de evaluador' })
  evaluatorName: string;
  // @IsNotEmpty({ message: 'username es requerido.' })
  // @IsString({ message: 'username debe ser un string.' })
  // @ApiProperty({ description: 'Nombre de usuario' })
  // username?: string;
  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser una cadena de texto.' })
  @ApiProperty({ description: 'Comentarios' })
  comments?: string;

  constructor(partial: Partial<EvaluationRequestDto>) {
    Object.assign(this, partial);
  }
}
