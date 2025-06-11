import { Inject, Injectable } from '@nestjs/common';
import {
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_IMAGE_SERVICE,
} from 'src/infraestructure/interface-provider';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationImageRepository } from 'src/infraestructure/repositories/evaluation-image-repository';
import { NotFoundException } from '../exception/not-found-exception';
import SecurityService from 'src/infraestructure/services/security/security.service';
import { WebdavService } from 'src/infraestructure/services/webdav/webdav.service';

@Injectable()
export class DeleteEvaluationDetail {
  constructor(
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
    private readonly securityService: SecurityService,
    private readonly webdavService: WebdavService,
  ) {}

  async execute(evaluationDetailId: number, token: string): Promise<string> {
    const userData = await this.securityService.GetUserData(token);
    const evaluationDetail =
      await this.evaluationDetailRepository.getEvaluationDetailById(
        evaluationDetailId,
      );
    if (!evaluationDetail) {
      throw new NotFoundException('Detalle de evaluación no encontrado');
    }
    const evaluationImages =
      await this.evaluationImageRepository.getAllEvaluationImagesByEvaluationDetailId(
        evaluationDetailId,
      );
    if (evaluationImages.length > 0) {
      Promise.all(
        evaluationImages.map(async (image) => {
          await this.webdavService.deleteImage(
            evaluationDetail.evaluation.referenceCode,
            image.imgPath,
          );
          await this.evaluationImageRepository.deleteEvaluationImage(
            image.nKey,
          );
        }),
      );
    }
    return await this.evaluationDetailRepository.deleteEvaluationDetail(
      evaluationDetailId,
      userData.employedUserName,
    );
  }
}
