import { Inject, Injectable } from '@nestjs/common';
import { EvaluationResponseDto } from '../dto/responses/evaluation-dto';
import {
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_IMAGE_SERVICE,
  EVALUATION_SERVICE,
} from 'src/infraestructure/interface-provider';
import { EvaluationRepository } from 'src/infraestructure/repositories/evaluation-repository';
import { NotFoundException } from '../exception/not-found-exception';
import { plainToInstance } from 'class-transformer';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationDetailResponseDto } from '../dto/responses/evaluation-detail-dto';
import { WebdavService } from 'src/infraestructure/services/webdav/webdav.service';
import { EvaluationImageRepository } from 'src/infraestructure/repositories/evaluation-image-repository';

@Injectable()
export class GetEvaluationByReferenceCode {
  constructor(
    @Inject(EVALUATION_SERVICE)
    private readonly evaluationRepository: EvaluationRepository,
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
    private readonly webdavService: WebdavService,
  ) {}

  async execute(referenceCode: string): Promise<EvaluationResponseDto> {
    const evaluation =
      await this.evaluationRepository.getEvaluationByReferenceCode(
        referenceCode,
      );
    const evaluationDetails =
      await this.evaluationDetailRepository.getAllEvaluationDetailsByReferenceCode(
        referenceCode,
      );
    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    const evaluationDetailsDto = await Promise.all(
      evaluationDetails.map(async (evaluationDetail) => {
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
            base64: await this.webdavService.getImage(
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
          date: new Date(evaluationDetail.date.getTime() - 6 * 60 * 60 * 1000),
        });
      }),
    );
    const evaluationDto = plainToInstance(EvaluationResponseDto, {
      ...evaluation,
      evaluationDetails: evaluationDetailsDto,
      date: new Date(evaluation.date.getTime() - 6 * 60 * 60 * 1000),
    });
    // console.log(evaluationDto);
    return evaluationDto;
  }
}
