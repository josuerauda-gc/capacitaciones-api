import { EvaluationEntity } from '../domain/entities/evaluation-entity';
import { CloseEvaluationDto } from '../dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from '../dto/requests/evaluation-dto';

export default interface IEvaluation {
  getAllEvaluations(): Promise<EvaluationEntity[]>;
  getEvaluationById(evaluationId: number): Promise<EvaluationEntity>;
  getEvaluationsByUsername(username: string): Promise<EvaluationEntity[]>;
  getEvaluationByReferenceCode(
    referenceCode: string,
  ): Promise<EvaluationEntity>;
  saveEvaluation(
    evaluation: EvaluationRequestDto,
    username: string,
  ): Promise<EvaluationEntity>;
  updateEvaluation(
    referenceCode: string,
    evaluation: EvaluationRequestDto,
  ): Promise<EvaluationEntity>;
  closeEvaluation(
    referenceCode: string,
    closeEvaluationDto: CloseEvaluationDto,
    username: string,
  ): Promise<EvaluationEntity>;
  deleteEvaluation(referenceCode: string, username: string): Promise<string>;
  // getAllEvaluationsByAreaId(areaId: number): Promise<EvaluationEntity[]>;
  // getAllEvaluationsByCategoryId(
  //   categoryId: number,
  // ): Promise<EvaluationEntity[]>;
  // getAllEvaluationsByTypeObservationId(
  //   typeObservationId: number,
  // ): Promise<EvaluationEntity[]>;
}
