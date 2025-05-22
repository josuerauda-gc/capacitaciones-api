import { Expose } from 'class-transformer';
import { EvaluationDetailResponseDto } from './evaluation-detail-dto';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluationResponseDto {
  @Expose()
  @ApiProperty({ description: 'ID de evaluación' })
  evaluationId: number;
  @Expose()
  @ApiProperty({ description: 'Código de referencia de evaluación' })
  referenceCode: string;
  @Expose()
  @ApiProperty({ description: 'ID de sucursal' })
  branchId: number;
  @Expose()
  @ApiProperty({ description: 'Nombre de sucursal' })
  branchName: string;
  @Expose()
  @ApiProperty({ description: 'Nombre de gerente de turno' })
  managerName: string;
  @Expose()
  @ApiProperty({ description: 'Nombre de evaluador' })
  evaluatorName: string;
  @Expose()
  @ApiProperty({ description: 'Nombre de usuario' })
  username: string;
  @Expose()
  @ApiProperty({ description: 'Comentarios' })
  comments: string;
  @Expose()
  @ApiProperty({ description: 'Se encuentra en evaluación' })
  isOpen: boolean;
  @Expose()
  @ApiProperty({ description: 'Fecha de evaluación' })
  date: Date;
  @Expose()
  @ApiProperty({ description: 'Detalles de Evaluación' })
  evaluationDetails?: EvaluationDetailResponseDto[];

  constructor(partial: Partial<EvaluationResponseDto>) {
    Object.assign(this, partial);
  }
}
