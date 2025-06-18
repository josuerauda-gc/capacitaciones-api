import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import SecurityService from 'src/infraestructure/services/security/security.service';

@Injectable()
export class DeleteEvaluationByReferenceCode {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    private readonly securityService: SecurityService,
  ) { }

  async execute(referenceCode: string, token: string): Promise<void> {
    const userData = await this.securityService.GetUserData(token);
    await this.evaluationRepository.deleteEvaluation(
      referenceCode,
      userData.employedUserName,
    );
  }
}
