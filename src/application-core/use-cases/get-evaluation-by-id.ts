import { Inject, Injectable } from '@nestjs/common';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import {
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_SERVICE,
} from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { NotFoundException } from '../exception/not-found-exception';
import { plainToInstance } from 'class-transformer';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationDetailResponseDto } from '../dto/responses/evaluation-detail-dto';

@Injectable()
export class GetEvaluationById {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
  ) {}

  async execute(evaluationId: number): Promise<EvaluationResponseDto> {
    const evaluation =
      await this.evaluationRepository.getEvaluationById(evaluationId);
    const evaluationDetails =
      await this.evaluationDetailRepository.getAllEvaluationDetailsByEvaluationId(
        evaluationId,
      );
    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    const evaluationDto = plainToInstance(EvaluationResponseDto, {
      ...evaluation,
      evaluationDetails:
        evaluationDetails.length > 0
          ? evaluationDetails.map((evaluationDetail) => {
              return plainToInstance(EvaluationDetailResponseDto, {
                ...evaluationDetail,
                evaluationId: evaluationDetail.evaluation.evaluationId,
                referenceCode: evaluationDetail.evaluation.referenceCode,
                areaId: evaluationDetail.area.areaId,
                areaName: evaluationDetail.area.description,
                categoryId: evaluationDetail.category.categoryId,
                categoryName: evaluationDetail.category.description,
                typeObservationId:
                  evaluationDetail.typeObservation.typeObservationId,
                typeObservationName:
                  evaluationDetail.typeObservation.description,
              });
            })
          : [],
    });
    return evaluationDto;
  }
}
