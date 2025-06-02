import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetLastsEvaluations {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
  ) {}

  async execute(): Promise<EvaluationResponseDto[]> {
    const evaluations = await this.evaluationRepository.getAllEvaluations();
    evaluations.forEach((evaluation) => {
      // Adjust the date to UTC-6
      evaluation.date = new Date(
        evaluation.date.getTime() - 6 * 60 * 60 * 1000,
      );
    });
    const lastsEvaluationsBranchByDate = evaluations.reduce(
      (acc, evaluation) => {
        const branchName = evaluation.branchName;
        const date = new Date(evaluation.date);
        if (!acc[branchName] || date > acc[branchName].evaluationDate) {
          acc[branchName] = evaluation;
        }
        return acc;
      },
      {},
    );
    const lastsEvaluations = Object.values(lastsEvaluationsBranchByDate);
    if (lastsEvaluations.length === 0) {
      return [];
    }
    return lastsEvaluations.map((evaluation) =>
      plainToInstance(EvaluationResponseDto, evaluation),
    );
  }
}
