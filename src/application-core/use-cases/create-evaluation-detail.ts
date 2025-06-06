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
import SecurityService from 'src/infraestructure/services/security/security.service';
import { WebdavService } from 'src/infraestructure/services/webdav/webdav.service';

Injectable();
export class CreateEvaluationDetail {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
    private readonly securityService: SecurityService,
    private readonly webdavService: WebdavService,
  ) {}

  async execute(
    evaluationDetailDto: EvaluationDetailRequestDto,
    token: string,
  ): Promise<any> {
    const userData = await this.securityService.GetUserData(token);
    const evaluationExists =
      await this.evaluationRepository.getEvaluationByReferenceCode(
        evaluationDetailDto.evaluationReferenceCode,
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
        userData.employedUserName,
      );
    const images = [];
    if (evaluationDetailDto.images) {
      if (evaluationDetailDto.images.length > 0) {
        for (const image of evaluationDetailDto.images) {
          await this.webdavService.saveImage(
            evaluationDetailDto.evaluationReferenceCode,
            image,
          );
          const newImage =
            await this.evaluationImageRepository.saveEvaluationImage(
              evaluationDetail,
              image,
            );
          images.push({
            nKey: newImage.nKey,
            name: newImage.imgPath,
            base64: await this.webdavService.getImage(
              evaluationDetailDto.evaluationReferenceCode,
              newImage.imgPath,
            ),
          });
        }
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
      date: new Date(newEvaluationDetail.date.getTime() - 6 * 60 * 60 * 1000),
      images,
    });
  }
}
