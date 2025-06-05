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
import SecurityService from 'src/infraestructure/services/security/security.service';
import { WebdavService } from 'src/infraestructure/services/webdav/webdav.service';
import { ValidationException } from '../exception/validation-exception';

@Injectable()
export class UpdateEvaluationDetail {
  constructor(
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
    @Inject(EVALUATION_IMAGE_SERVICE)
    private readonly evaluationImageRepository: EvaluationImageRepository,
    private readonly securityService: SecurityService,
    private readonly webdavService: WebdavService,
  ) { }

  async execute(
    evaluationDetailId: number,
    evaluationDetailDto: EvaluationDetailRequestDto,
    token: string,
  ): Promise<EvaluationDetailResponseDto> {
    const userData = await this.securityService.GetUserData(token);
    const evaluationDetail =
      await this.evaluationDetailRepository.updateEvaluationDetail(
        evaluationDetailId,
        evaluationDetailDto,
        userData.employedUserName,
      );
    if (!evaluationDetail) {
      throw new NotFoundException('Detalle de evaluación no encontrado');
    }
    const images = [];
    const evaluationDetailImages =
      await this.evaluationImageRepository.getAllEvaluationImagesByEvaluationDetailId(
        evaluationDetailId,
      );
    if (evaluationDetailDto.images) {
      if (evaluationDetailDto.images.length > 0) {
        evaluationDetailDto.images.forEach(async (image) => {
          if (!(image.blobFile instanceof Blob)) {
            throw new ValidationException(
              'El archivo de imagen debe ser un Blob',
            );
          }
          // Guardar la imagen si no existe
          const existingImage = evaluationDetailImages.find(
            (img) => img.nKey === image.idImg,
          );
          if (image.idImg && existingImage) {
            images.push({
              nKey: existingImage.nKey,
              name: existingImage.imgPath,
              blobFile: await this.webdavService.getImage(
                evaluationDetail.evaluation.referenceCode,
                existingImage.imgPath,
              ),
            });
          }
          if (!existingImage) {
            await this.webdavService.saveImage(
              evaluationDetail.evaluation.referenceCode,
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
              blobFile: await this.webdavService.getImage(
                evaluationDetail.evaluation.referenceCode,
                newImage.imgPath,
              ),
            });
          }
          // Eliminar la imagen si no está en la lista de imágenes enviadas
          const imageToDelete = evaluationDetailImages.find(
            (img) => img.nKey !== image.idImg,
          );
          if (imageToDelete) {
            await this.webdavService.deleteImage(
              evaluationDetail.evaluation.referenceCode,
              imageToDelete.imgPath,
            );
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
      date: new Date(evaluationDetail.date.getTime() - 6 * 60 * 60 * 1000),
    });
  }
}
