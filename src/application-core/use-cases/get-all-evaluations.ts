import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import { plainToInstance } from 'class-transformer';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';

@Injectable()
export class GetAllEvaluations {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
  ) {}

  async execute(): Promise<EvaluationResponseDto[]> {
    const evaluations = await this.evaluationRepository.getAllEvaluations();
    if (evaluations.length === 0) {
      return [];
    }
    const evaluationsDto = evaluations.map((evaluation) =>
      plainToInstance(EvaluationResponseDto, evaluation),
    );
    return evaluationsDto;
  }
}
