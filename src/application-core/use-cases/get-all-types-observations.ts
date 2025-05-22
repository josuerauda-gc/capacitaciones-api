import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TYPE_OBSERVATION_SERVICE } from 'src/infraestructure/interface-provider';
import { TypeObservationRepository } from 'src/infraestructure/repositories/type-observation-repository';
import { TypeObservationDto } from '../dto/general/type-observation-dto';

@Injectable()
export class GetAllTypesObservations {
  constructor(
    @Inject(TYPE_OBSERVATION_SERVICE)
    private readonly typeObservationRepository: TypeObservationRepository,
  ) {}

  async execute(): Promise<TypeObservationDto[]> {
    const typeObservations =
      await this.typeObservationRepository.getAllTypeObservations();
    return plainToInstance(TypeObservationDto, typeObservations, {
      excludeExtraneousValues: true,
    });
  }
}
