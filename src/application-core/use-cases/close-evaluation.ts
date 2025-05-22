import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { CloseEvaluationDto } from '../dto/requests/close-evaluation-dto';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';

@Injectable()
export class CloseEvaluation {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
  ) {}

  async execute(
    evaluationId: number,
    closeEvaluationDto: CloseEvaluationDto,
  ): Promise<EvaluationResponseDto> {
    const evaluation = await this.evaluationRepository.closeEvaluation(
      evaluationId,
      closeEvaluationDto,
    );
    return evaluation;
  }
}
