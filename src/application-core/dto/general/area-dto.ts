import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class AreaDto {
  @Exclude()
  nKey: number;
  @Expose()
  @ApiProperty({ description: 'ID de área' })
  areaId: number;
  @Expose()
  @ApiProperty({ description: 'Descripción' })
  description: boolean;
  @Expose()
  @ApiProperty({ description: 'Activo' })
  active: boolean;

  constructor(partial: Partial<AreaDto>) {
    Object.assign(this, partial);
  }
}
