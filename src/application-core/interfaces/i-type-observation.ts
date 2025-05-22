import { TypeObservationEntity } from '../domain/entities/type-observation-entity';

export default interface ITypeObservation {
  getAllTypeObservations(): Promise<TypeObservationEntity[]>;
}
