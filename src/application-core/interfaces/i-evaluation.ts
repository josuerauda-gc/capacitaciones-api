import { EvaluationEntity } from '../domain/entities/evaluation-entity';
import { CloseEvaluationDto } from '../dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from '../dto/requests/evaluation-dto';

export default interface IEvaluation {
  getAllEvaluations(): Promise<EvaluationEntity[]>;
  getEvaluationById(id: number): Promise<EvaluationEntity>;
  saveEvaluation(
    evaluation: EvaluationRequestDto,
    username: string,
  ): Promise<EvaluationEntity>;
  updateEvaluation(
    id: number,
    evaluation: EvaluationRequestDto,
  ): Promise<EvaluationEntity>;
  closeEvaluation(
    id: number,
    closeEvaluationDto: CloseEvaluationDto,
    username: string,
  ): Promise<EvaluationEntity>;
  // deleteEvaluation(id: number): Promise<string>;
  // getAllEvaluationsByAreaId(areaId: number): Promise<EvaluationEntity[]>;
  // getAllEvaluationsByCategoryId(
  //   categoryId: number,
  // ): Promise<EvaluationEntity[]>;
  // getAllEvaluationsByTypeObservationId(
  //   typeObservationId: number,
  // ): Promise<EvaluationEntity[]>;
}
