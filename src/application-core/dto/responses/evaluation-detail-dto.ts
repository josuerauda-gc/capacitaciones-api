import { Exclude, Expose, Type } from 'class-transformer';
import { ImagesDto } from '../general/images-dto';
import { ApiProperty } from '@nestjs/swagger';
import { AreaEntity } from 'src/application-core/domain/entities/area-entity';
import { CategoryEntity } from 'src/application-core/domain/entities/category-entity';
import { TypeObservationEntity } from 'src/application-core/domain/entities/type-observation-entity';
import { EvaluationEntity } from 'src/application-core/domain/entities/evaluation-entity';

export class EvaluationDetailResponseDto {
  @Expose()
  @ApiProperty({ description: 'ID de detalle de evaluación' })
  evaluationDetailId: number;
  @Exclude()
  evaluation: EvaluationEntity;
  @Expose()
  @ApiProperty({ description: 'Código de referencia de evaluación' })
  referenceCode: string;
  @Expose()
  @ApiProperty({ description: 'ID de evaluación' })
  evaluationId: number;
  @Exclude()
  area: AreaEntity;
  @Expose()
  @ApiProperty({ description: 'ID de área' })
  areaId: number;
  @Expose()
  @ApiProperty({ description: 'Nombre de área' })
  areaName: string;
  @Exclude()
  category: CategoryEntity;
  @Expose()
  @ApiProperty({ description: 'ID de categoría' })
  categoryId: number;
  @Expose()
  @ApiProperty({ description: 'Nombre de categoría' })
  categoryName: string;
  @Exclude()
  typeObservation: TypeObservationEntity;
  @Expose()
  @ApiProperty({ description: 'ID de tipo de observación' })
  typeObservationId: number;
  @Expose()
  @ApiProperty({ description: 'Descripción de tipo de observación' })
  typeObservationDescription: string;
  @Expose()
  @ApiProperty({ description: 'Comentarios' })
  comments: string;
  @Expose()
  @Type(() => ImagesDto)
  @ApiProperty({ description: 'Listado de imagenes', type: [ImagesDto] })
  images?: ImagesDto[];
  @Expose()
  @ApiProperty()
  date: Date;

  constructor(partial: Partial<EvaluationDetailResponseDto>) {
    Object.assign(this, partial);
  }
}
