import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class TypeObservationDto {
  @Exclude()
  nKey: number;
  @Expose()
  @ApiProperty({ description: 'ID de tipo de observación' })
  typeObservationId: number;
  @Expose()
  @ApiProperty({ description: 'Descripción' })
  description: string;
  @Expose()
  @ApiProperty({ description: 'Activo' })
  active: boolean;

  constructor(partial: Partial<TypeObservationDto>) {
    Object.assign(this, partial);
  }
}
