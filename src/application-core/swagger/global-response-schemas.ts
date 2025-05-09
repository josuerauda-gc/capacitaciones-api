import { ApiProperty } from '@nestjs/swagger';

export class GlobalResponseSchema<T> {
  @ApiProperty({ description: 'Indica si la operación fue exitosa o no' })
  public success: boolean;
  @ApiProperty({ description: 'Mensaje de la operación' })
  public message: string;
  @ApiProperty({ description: 'Errores de la operación' })
  public errors: string[];
  @ApiProperty({
    description: 'Datos de la operación',
  })
  public data: T;
}
