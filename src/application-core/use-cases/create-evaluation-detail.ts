import { Inject, Injectable } from '@nestjs/common';
import {
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_IMAGE_SERVICE,
  EVALUATION_SERVICE,
} from 'src/infraestructure/interface-provider';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationDetailRequestDto } from '../dto/requests/evaluation-detail-dto';
import { EvaluationImageRepository } from 'src/infraestructure/repositories/evaluation-image-repository';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { ValidationException } from '../exception/validation-exception';
import { plainToInstance } from 'class-transformer';
import { EvaluationDetailResponseDto } from '../dto/responses/evaluation-detail-dto';

Injectable();
export class CreateEvaluationDetail {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
  ) {}

  async execute(evaluationDetailDto: EvaluationDetailRequestDto): Promise<any> {
    const evaluationExists = await this.evaluationRepository.getEvaluationById(
      evaluationDetailDto.evaluationId,
    );
    if (!evaluationExists) {
      throw new ValidationException(
        'La evaluación no existe, por favor verifique el ID de la evaluación',
      );
    }
    if (!evaluationExists.isOpen) {
      throw new ValidationException('La evaluación no se encuentra abierta');
    }
    const evaluationDetail =
      await this.evaluationDetailRepository.saveEvaluationDetail(
        evaluationDetailDto,
      );
    if (evaluationDetailDto.images) {
      if (evaluationDetailDto.images.length > 0) {
        evaluationDetailDto.images.forEach(async (image) => {
          await this.evaluationImageRepository.saveEvaluationImage(
            evaluationDetail,
            image,
          );
        });
      }
    }
    const newEvaluationDetail =
      await this.evaluationDetailRepository.getEvaluationDetailById(
        evaluationDetail.evaluationDetailId,
      );
    return plainToInstance(EvaluationDetailResponseDto, {
      ...newEvaluationDetail,
      evaluationId: newEvaluationDetail.evaluation.evaluationId,
      referenceCode: newEvaluationDetail.evaluation.referenceCode,
      areaId: newEvaluationDetail.area.areaId,
      areaName: newEvaluationDetail.area.description,
      categoryId: newEvaluationDetail.category.categoryId,
      categoryName: newEvaluationDetail.category.description,
      typeObservationId: newEvaluationDetail.typeObservation.typeObservationId,
      typeObservationName: newEvaluationDetail.typeObservation.description,
    });
  }
}
