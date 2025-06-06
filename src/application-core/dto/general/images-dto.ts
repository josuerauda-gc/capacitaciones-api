import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBase64, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsNotEmpty({ message: 'base64 es requerido' })
  @IsBase64({}, { message: 'base64 debe ser una cadena Base64 válida' })
  @ApiProperty({ description: 'Base64 de imagen' })
  base64: string;

  constructor(partial: Partial<ImagesDto>) {
    Object.assign(this, partial);
  }
}
