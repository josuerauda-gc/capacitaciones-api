import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ImagesDto {
  @Expose({ name: 'nKey' })
  @IsOptional()
  @ApiProperty({ description: 'ID de imagen' })
  idImg: number;
  @Expose()
  @IsNotEmpty({ message: 'name es requerido' })
  @IsString({ message: 'name debe ser un string' })
  @ApiProperty({ description: 'Nombre de imagen' })
  name: string;
  @Expose()
  @IsNotEmpty({ message: 'blobFile es requerido' })
  @ApiProperty({ description: 'Archivo blob de imagen' })
  blobFile: Blob;

  constructor(partial: Partial<ImagesDto>) {
    Object.assign(this, partial);
  }
}
