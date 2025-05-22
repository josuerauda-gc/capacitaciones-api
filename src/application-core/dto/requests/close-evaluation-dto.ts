import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EvaluationRequestDto } from './evaluation-dto';

export class CloseEvaluationDto {
  @IsNotEmpty({ message: 'managerName es requerido.' })
  @IsString({ message: 'managerName debe ser un string.' })
  @ApiProperty({ description: 'Nombre de gerente de turno' })
  managerName: string;

  @IsOptional()
  @ApiProperty({ description: 'Comentarios' })
  comments?: string;

  constructor(partial: Partial<EvaluationRequestDto>) {
    Object.assign(this, partial);
  }
}
