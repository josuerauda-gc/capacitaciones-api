import { ApiProperty } from '@nestjs/swagger';
import { GlobalResponseSchema } from './global-response-schemas';

class ExampleResponseDto {}

export class ExampleArrayResponse extends GlobalResponseSchema<
  ExampleResponseDto[]
> {
  @ApiProperty({
    type: [ExampleResponseDto],
  })
  public data: ExampleResponseDto[];
}

export class ExampleResponse extends GlobalResponseSchema<ExampleResponseDto> {
  @ApiProperty({
    type: ExampleResponseDto,
  })
  public data: ExampleResponseDto;
}
