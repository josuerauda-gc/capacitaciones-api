import { AreaEntity } from '../domain/entities/area-entity';

export default interface IArea {
  getAllAreas(): Promise<AreaEntity[]>;
}
