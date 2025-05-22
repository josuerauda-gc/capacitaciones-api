import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { EvaluationRequestDto } from '../dto/requests/evaluation-dto';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateEvaluation {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
  ) {}

  async execute(
    evaluationDto: EvaluationRequestDto,
  ): Promise<EvaluationResponseDto> {
    if (!evaluationDto.comments) {
      evaluationDto.comments = '';
    }
    const evaluation =
      await this.evaluationRepository.saveEvaluation(evaluationDto);
    if (!evaluation) {
      return null;
    }
    const evaluationDtoResponse = plainToInstance(
      EvaluationResponseDto,
      evaluation,
    );
    return evaluationDtoResponse;
  }
}
