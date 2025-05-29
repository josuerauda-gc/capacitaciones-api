import { Inject, Injectable } from '@nestjs/common';
import {
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_IMAGE_SERVICE,
} from 'src/infraestructure/interface-provider';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationDetailResponseDto } from '../dto/responses/evaluation-detail-dto';
import { NotFoundException } from '../exception/not-found-exception';
import { plainToInstance } from 'class-transformer';
import { EvaluationImageRepository } from 'src/infraestructure/repositories/evaluation-image-repository';
import { WebdavService } from 'src/infraestructure/services/webdav/webdav.service';

@Injectable()
export class GetEvaluationDetailById {
  constructor(
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
    private readonly webdavService: WebdavService,
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
    let images =
      await this.evaluationImageRepository.getAllEvaluationImagesByEvaluationDetailId(
        evaluationDetail.evaluationDetailId,
      );
    if (images.length === 0) {
      images = [];
    }
    const imagesDto = await Promise.all(
      images.map(async (image) => ({
        nKey: image.nKey,
        name: image.imgPath,
        blobFile: await this.webdavService.getImage(
          evaluationDetail.evaluation.referenceCode,
          image.imgPath,
        ),
      })),
    );
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
      images: imagesDto,
    });
  }
}
