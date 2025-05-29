import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { EvaluationRequestDto } from '../dto/requests/evaluation-dto';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import { plainToInstance } from 'class-transformer';
import SecurityService from 'src/infraestructure/services/security/security.service';

@Injectable()
export class CreateEvaluation {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    private readonly securityService: SecurityService,
  ) {}

  async execute(
    evaluationDto: EvaluationRequestDto,
    token: string,
  ): Promise<EvaluationResponseDto> {
    const userData = await this.securityService.GetUserData(token);
    // console.log(userData);
    if (!evaluationDto.comments) {
      evaluationDto.comments = '';
    }
    const evaluation = await this.evaluationRepository.saveEvaluation(
      evaluationDto,
      userData.employedUserName,
    );
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
