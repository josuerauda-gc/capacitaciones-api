import { Controller, Get } from '@nestjs/common';
import { TypeObservationDto } from 'src/application-core/dto/general/type-observation-dto';
import { GetAllTypesObservations } from 'src/application-core/use-cases/get-all-types-observations';

@Controller('types-observations')
export class TypesObservationsController {
  constructor(
    private readonly getAllTypesObservations: GetAllTypesObservations,
  ) {}

  @Get()
  async getAllTypesObservationsHandler(): Promise<TypeObservationDto[]> {
    return this.getAllTypesObservations.execute();
  }
}
