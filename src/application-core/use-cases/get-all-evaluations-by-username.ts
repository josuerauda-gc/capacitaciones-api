import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import SecurityService from 'src/infraestructure/services/security/security.service';

@Injectable()
export class GetAllEvaluationsByUsername {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    private readonly securityService: SecurityService,
  ) {}

  async execute(token: string): Promise<EvaluationResponseDto[]> {
    const userData = await this.securityService.GetUserData(token);
    const username = userData.employedUserName;
    // console.log(`Fetching evaluations for user: ${username}`);
    const evaluations =
      await this.evaluationRepository.getEvaluationsByUsername(username);
    return evaluations;
  }
}
