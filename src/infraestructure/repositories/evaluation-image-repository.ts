import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationDetailEntity } from 'src/application-core/domain/entities/evaluation-detail-entity';
import { ImageEvaluationEntity } from 'src/application-core/domain/entities/image-evaluation-entity';
import { ImagesDto } from 'src/application-core/dto/general/images-dto';
import IEvaluationImage from 'src/application-core/interfaces/i-evaluation-image';
import { Repository } from 'typeorm';

Injectable();
export class EvaluationImageRepository implements IEvaluationImage {
  constructor(
    @InjectRepository(ImageEvaluationEntity)
    private readonly evaluationImageRepository: Repository<ImageEvaluationEntity>,
  ) {}

  async getAllEvaluationImages(): Promise<ImageEvaluationEntity[]> {
    return await this.evaluationImageRepository.find();
  }

  async getEvaluationImageById(id: number): Promise<ImageEvaluationEntity> {
    return await this.evaluationImageRepository.findOne({
      where: { nKey: id },
    });
  }

  async saveEvaluationImage(
    evaluationDetail: EvaluationDetailEntity,
    evaluationImage: ImagesDto,
  ): Promise<ImageEvaluationEntity> {
    const newEvaluationImage: ImageEvaluationEntity = {
      nKey: null,
      imgPath: evaluationImage.name,
      evaluationDetail,
      date: new Date(),
    };
    return await this.evaluationImageRepository.save(newEvaluationImage);
  }

  async deleteEvaluationImage(id: number): Promise<string> {
    const existingEvaluationImage =
      await this.evaluationImageRepository.findOne({
        where: { nKey: id },
      });
    if (!existingEvaluationImage) {
      return 'No se encontró la imagen de evaluación';
    }
    await this.evaluationImageRepository.delete(id);
    return 'Imagen de evaluación eliminada correctamente';
  }

  async getAllEvaluationImagesByEvaluationDetailId(
    evaluationDetailId: number,
  ): Promise<ImageEvaluationEntity[]> {
    return await this.evaluationImageRepository.find({
      relations: {
        evaluationDetail: true,
      },
      where: { evaluationDetail: { evaluationDetailId: evaluationDetailId } },
    });
  }
}
