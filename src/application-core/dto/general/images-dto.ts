import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBase64, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ImagesDto {
  @Expose({ name: 'nKey' })
  @IsOptional()
  @ApiProperty({ description: 'ID de imagen' })
  idImg?: number;
  @Expose()
  @IsNotEmpty({ message: 'El nombre de la imagen es requerido' })
  @IsString({ message: 'El nombre de la imagen debe ser una cadena de texto' })
  @ApiProperty({ description: 'Nombre de imagen' })
  name: string;
  @Expose()
  @IsNotEmpty({ message: 'Contenido de imagen es requerida.' })
  @IsString({
    message:
      'La imagen no ha sido seleccionada. Detalle técnico: base64 debe ser una cadena de texto.',
  })
  @IsBase64(
    {},
    {
      message:
        'La imagen no ha sido procesada correctamente. Detalle técnico: base64 debe ser una cadena Base64 válida.',
    },
  )
  @ApiProperty({ description: 'Base64 de imagen', type: String })
  base64: string;

  constructor(partial: Partial<ImagesDto>) {
    Object.assign(this, partial);
  }
}
