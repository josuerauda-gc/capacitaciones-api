import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeObservationEntity } from 'src/application-core/domain/entities/type-observation-entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeObservationRepository {
  constructor(
    @InjectRepository(TypeObservationEntity)
    private readonly typeObservationRepository: Repository<TypeObservationEntity>,
  ) {}

  getAllTypeObservations(): Promise<TypeObservationEntity[]> {
    return this.typeObservationRepository.find({
      where: { active: true },
    });
  }
}
