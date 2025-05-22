import { Inject, Injectable } from '@nestjs/common';
import {
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_IMAGE_SERVICE,
} from 'src/infraestructure/interface-provider';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationImageRepository } from 'src/infraestructure/repositories/evaluation-image-repository';
import { NotFoundException } from '../exception/not-found-exception';

@Injectable()
export class DeleteEvaluationDetail {
  constructor(
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
  ) {}

  async execute(evaluationDetailId: number): Promise<string> {
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
      evaluationImages.forEach(async (image) => {
        await this.evaluationImageRepository.deleteEvaluationImage(image.nKey);
      });
    }
    return await this.evaluationDetailRepository.deleteEvaluationDetail(
      evaluationDetailId,
    );
  }
}
