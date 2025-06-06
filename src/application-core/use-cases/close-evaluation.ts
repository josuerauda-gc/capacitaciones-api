import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { CloseEvaluationDto } from '../dto/requests/close-evaluation-dto';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import SecurityService from 'src/infraestructure/services/security/security.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CloseEvaluation {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    private readonly securityService: SecurityService,
  ) {}

  async execute(
    referenceCode: string,
    closeEvaluationDto: CloseEvaluationDto,
    token: string,
  ): Promise<EvaluationResponseDto> {
    const userData = await this.securityService.GetUserData(token);
    const evaluation = await this.evaluationRepository.closeEvaluation(
      referenceCode,
      closeEvaluationDto,
      userData.employedUserName,
    );
    return plainToInstance(EvaluationResponseDto, {
      ...evaluation,
      date: new Date(evaluation.date.getTime() - 6 * 60 * 60 * 1000),
    });
  }
}
