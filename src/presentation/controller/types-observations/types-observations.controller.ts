import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TypeObservationDto } from 'src/application-core/dto/general/type-observation-dto';
import { GetAllTypesObservations } from 'src/application-core/use-cases/get-all-types-observations';

@Controller('types-observations')
export class TypesObservationsController {
  constructor(
    private readonly getAllTypesObservations: GetAllTypesObservations,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listado de tipos de observación de evaluación',
    type: TypeObservationDto,
  })
  async getAllTypesObservationsHandler(): Promise<TypeObservationDto[]> {
    return this.getAllTypesObservations.execute();
  }
}
