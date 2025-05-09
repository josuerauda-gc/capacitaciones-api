import { ApiProperty } from '@nestjs/swagger';

export class GlobalErrorResponseSchema {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa o no',
    example: false,
  })
  public success: boolean;
  @ApiProperty({ description: 'Mensaje de la operación' })
  public message: string;
  @ApiProperty({ description: 'Errores de la operación' })
  public errors: string[];
  @ApiProperty({
    description: 'Datos de la operación',
    nullable: true,
    type: 'null',
    example: 'null',
  })
  public data: null;
}
