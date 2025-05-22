import { EvaluationDetailEntity } from '../domain/entities/evaluation-detail-entity';
import { ImageEvaluationEntity } from '../domain/entities/image-evaluation-entity';
import { ImagesDto } from '../dto/general/images-dto';

export default interface IEvaluationImage {
  getAllEvaluationImages(): Promise<ImageEvaluationEntity[]>;
  getEvaluationImageById(id: number): Promise<ImageEvaluationEntity>;
  saveEvaluationImage(
    evaluationDetail: EvaluationDetailEntity,
    evaluationImage: ImagesDto,
  ): Promise<ImageEvaluationEntity>;
  // updateEvaluationImage(
  //   evaluationDetail: EvaluationDetailEntity,
  //   evaluationImage: ImagesDto,
  // ): Promise<ImageEvaluationEntity>;
  deleteEvaluationImage(id: number): Promise<string>;
  getAllEvaluationImagesByEvaluationDetailId(
    evaluationDetailId: number,
  ): Promise<ImageEvaluationEntity[]>;
}
