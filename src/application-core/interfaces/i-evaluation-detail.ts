import { EvaluationDetailEntity } from '../domain/entities/evaluation-detail-entity';
import { EvaluationDetailRequestDto } from '../dto/requests/evaluation-detail-dto';

export default interface IEvaluationDetail {
  getAllEvaluationDetails(): Promise<EvaluationDetailEntity[]>;
  getEvaluationDetailById(id: number): Promise<EvaluationDetailEntity>;
  saveEvaluationDetail(
    evaluationDetail: EvaluationDetailRequestDto,
  ): Promise<EvaluationDetailEntity>;
  updateEvaluationDetail(
    id: number,
    evaluationDetail: EvaluationDetailRequestDto,
  ): Promise<EvaluationDetailEntity>;
  deleteEvaluationDetail(id: number): Promise<string>;
  getAllEvaluationDetailsByEvaluationId(
    evaluationId: number,
  ): Promise<EvaluationDetailEntity[]>;
  // getAllEvaluationDetailsByObservationId(
  //   observationId: number,
  // ): Promise<EvaluationDetailEntity[]>;
  // getAllEvaluationDetailsByTypeObservationId(
  //   typeObservationId: number,
  // ): Promise<EvaluationDetailEntity[]>;
}
