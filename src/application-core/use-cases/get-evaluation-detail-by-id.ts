import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_DETAIL_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationDetailResponseDto } from '../dto/responses/evaluation-detail-dto';
import { NotFoundException } from '../exception/not-found-exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetEvaluationDetailById {
  constructor(
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
  ) {}

  async execute(
    evaluationDetailId: number,
  ): Promise<EvaluationDetailResponseDto> {
    const evaluationDetail =
      await this.evaluationDetailRepository.getEvaluationDetailById(
        evaluationDetailId,
      );
    if (!evaluationDetail) {
      throw new NotFoundException('Detalle de evaluación no encontrado');
    }
    return plainToInstance(EvaluationDetailResponseDto, {
      ...evaluationDetail,
      evaluationId: evaluationDetail.evaluation.evaluationId,
      referenceCode: evaluationDetail.evaluation.referenceCode,
      areaId: evaluationDetail.area.areaId,
      areaName: evaluationDetail.area.description,
      categoryId: evaluationDetail.category.categoryId,
      categoryName: evaluationDetail.category.description,
      typeObservationId: evaluationDetail.typeObservation.typeObservationId,
      typeObservationName: evaluationDetail.typeObservation.description,
    });
  }
}
