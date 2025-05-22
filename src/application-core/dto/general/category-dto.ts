import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CategoryDto {
  @Exclude()
  nKey: number;
  @Expose()
  @ApiProperty({ description: 'ID de categoría' })
  categoryId: number;
  @Expose()
  @ApiProperty({ description: 'Descripción' })
  description: string;
  @Expose()
  @ApiProperty({ description: 'Activo' })
  active: boolean;

  constructor(partial: Partial<CategoryDto>) {
    Object.assign(this, partial);
  }
}
