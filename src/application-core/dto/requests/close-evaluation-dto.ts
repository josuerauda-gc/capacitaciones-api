import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EvaluationRequestDto } from './evaluation-dto';

export class CloseEvaluationDto {
  @IsNotEmpty({ message: 'Nombre de gerente es requerido.' })
  @IsString({ message: 'Nombre de gerente debe ser una cadena de texto.' })
  @ApiProperty({ description: 'Nombre de gerente de turno' })
  managerName: string;

  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser una cadena de texto.' })
  @ApiProperty({ description: 'Comentarios' })
  comments: string;

  constructor(partial: Partial<EvaluationRequestDto>) {
    Object.assign(this, partial);
  }
}
