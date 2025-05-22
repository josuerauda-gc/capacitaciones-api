import { AreaEntity } from './entities/area-entity';
import { CategoryEntity } from './entities/category-entity';
import { EvaluationDetailEntity } from './entities/evaluation-detail-entity';
import { EvaluationEntity } from './entities/evaluation-entity';
import { ImageEvaluationEntity } from './entities/image-evaluation-entity';
import { TypeObservationEntity } from './entities/type-observation-entity';

const ENTITIES = [
  AreaEntity,
  CategoryEntity,
  TypeObservationEntity,
  EvaluationEntity,
  EvaluationDetailEntity,
  ImageEvaluationEntity,
];

export default ENTITIES;
//aqui se colocan las entidades de typeorm para ser exportadas
