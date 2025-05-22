import { Inject, Injectable } from '@nestjs/common';
import {
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_IMAGE_SERVICE,
} from 'src/infraestructure/interface-provider';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { EvaluationDetailRequestDto } from '../dto/requests/evaluation-detail-dto';
import { EvaluationDetailResponseDto } from '../dto/responses/evaluation-detail-dto';
import { NotFoundException } from '../exception/not-found-exception';
import { plainToInstance } from 'class-transformer';
import { EvaluationImageRepository } from 'src/infraestructure/repositories/evaluation-image-repository';

@Injectable()
export class UpdateEvaluationDetail {
  constructor(
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
  ) {}

  async execute(
    evaluationDetailId: number,
    evaluationDetailDto: EvaluationDetailRequestDto,
  ): Promise<EvaluationDetailResponseDto> {
    const evaluationDetail =
      await this.evaluationDetailRepository.updateEvaluationDetail(
        evaluationDetailId,
        evaluationDetailDto,
      );
    if (!evaluationDetail) {
      throw new NotFoundException('Detalle de evaluación no encontrado');
    }
    const evaluationDetailImages =
      await this.evaluationImageRepository.getAllEvaluationImagesByEvaluationDetailId(
        evaluationDetailId,
      );

    if (evaluationDetailDto.images) {
      if (evaluationDetailDto.images.length > 0) {
        evaluationDetailDto.images.forEach(async (image) => {
          // Guardar la imagen si no existe
          const existingImage = evaluationDetailImages.find(
            (img) => img.nKey === image.idImg,
          );
          if (!existingImage) {
            await this.evaluationImageRepository.saveEvaluationImage(
              evaluationDetail,
              image,
            );
          }
          // Eliminar la imagen si no está en la lista de imágenes enviadas
          const imageToDelete = evaluationDetailImages.find(
            (img) => img.nKey !== image.idImg,
          );
          if (imageToDelete) {
            await this.evaluationImageRepository.deleteEvaluationImage(
              imageToDelete.nKey,
            );
          }
        });
      }
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
