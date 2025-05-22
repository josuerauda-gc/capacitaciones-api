import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationDetailEntity } from 'src/application-core/domain/entities/evaluation-detail-entity';
import { EvaluationDetailRequestDto } from 'src/application-core/dto/requests/evaluation-detail-dto';
import IEvaluationDetail from 'src/application-core/interfaces/i-evaluation-detail';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluationDetailsRepository implements IEvaluationDetail {
  constructor(
    @InjectRepository(EvaluationDetailEntity)
    private readonly evaluationDetailRepository: Repository<EvaluationDetailEntity>,
  ) {}

  async getAllEvaluationDetails(): Promise<EvaluationDetailEntity[]> {
    return await this.evaluationDetailRepository.find({
      relations: {
        evaluation: true,
        area: true,
        category: true,
        typeObservation: true,
      },
      order: { evaluationDetailId: 'DESC' },
    });
  }

  async getEvaluationDetailById(id: number): Promise<EvaluationDetailEntity> {
    return await this.evaluationDetailRepository.findOne({
      where: { evaluationDetailId: id },
      relations: {
        evaluation: true,
        area: true,
        category: true,
        typeObservation: true,
      },
    });
  }

  async saveEvaluationDetail(
    evaluationDetail: EvaluationDetailRequestDto,
  ): Promise<EvaluationDetailEntity> {
    return await this.evaluationDetailRepository.save({
      evaluation: { evaluationId: evaluationDetail.evaluationId },
      category: { nKey: evaluationDetail.categoryId },
      area: { nKey: evaluationDetail.areaId },
      typeObservation: {
        nKey: evaluationDetail.typeObservationId,
      },
      comments: evaluationDetail.comments,
    });
  }

  async updateEvaluationDetail(
    id: number,
    evaluationDetail: EvaluationDetailRequestDto,
  ): Promise<EvaluationDetailEntity> {
    const existingEvaluationDetail =
      await this.evaluationDetailRepository.findOne({
        where: { evaluationDetailId: id },
        relations: {
          evaluation: true,
          area: true,
          category: true,
          typeObservation: true,
        },
      });
    const updatedEvaluationDetail = {
      ...existingEvaluationDetail,
      ...evaluationDetail,
    };
    return await this.evaluationDetailRepository.save(updatedEvaluationDetail);
  }

  async deleteEvaluationDetail(id: number): Promise<string> {
    const existingEvaluationDetail =
      await this.evaluationDetailRepository.findOne({
        where: { evaluationDetailId: id },
      });
    if (!existingEvaluationDetail) {
      return 'No se encontró el detalle de evaluación';
    }
    await this.evaluationDetailRepository.delete(id);
    return 'Detalle de evaluación eliminado correctamente';
  }

  async getAllEvaluationDetailsByEvaluationId(
    evaluationId: number,
  ): Promise<EvaluationDetailEntity[]> {
    return await this.evaluationDetailRepository.find({
      relations: {
        evaluation: true,
        area: true,
        category: true,
        typeObservation: true,
      },
      where: { evaluation: { evaluationId: evaluationId } },
    });
  }
}
