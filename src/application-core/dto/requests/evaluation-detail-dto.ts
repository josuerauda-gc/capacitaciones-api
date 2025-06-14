import { ApiProperty } from '@nestjs/swagger';
import { ImagesDto } from '../general/images-dto';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class EvaluationDetailRequestDto {
  @IsNotEmpty({
    message: 'Código de referencia de evaluación no debe ser vacío',
  })
  @ApiProperty({ description: 'Código de referencia de evaluación' })
  evaluationReferenceCode: string;
  @IsNotEmpty({ message: 'ID de área no debe ser vacío' })
  @ApiProperty({ description: 'ID de área' })
  areaId: number;
  @IsNotEmpty({ message: 'ID de categoría no debe ser vacío' })
  @ApiProperty({ description: 'ID de categoría' })
  categoryId: number;
  @IsNotEmpty({ message: 'ID de tipo de observación no debe ser vacío' })
  @ApiProperty({ description: 'ID de tipo de observación' })
  typeObservationId: number;
  @IsNotEmpty({ message: 'Comentarios no debe ser vacío' })
  @ApiProperty({ description: 'Comentarios' })
  comments: string;
  @IsOptional()
  @IsArray({ message: 'images debe ser un arreglo.' })
  @ApiProperty({ description: 'Listado de imagenes', type: [ImagesDto] })
  images?: ImagesDto[];

  constructor(partial: Partial<EvaluationDetailRequestDto>) {
    Object.assign(this, partial);
  }
}
