import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationDetailEntity } from 'src/application-core/domain/entities/evaluation-detail-entity';
import { EvaluationEntity } from 'src/application-core/domain/entities/evaluation-entity';
import { EvaluationDetailRequestDto } from 'src/application-core/dto/requests/evaluation-detail-dto';
import { NotFoundException } from 'src/application-core/exception/not-found-exception';
import { ValidationException } from 'src/application-core/exception/validation-exception';
import IEvaluationDetail from 'src/application-core/interfaces/i-evaluation-detail';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluationDetailsRepository implements IEvaluationDetail {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
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
    username: string,
  ): Promise<EvaluationDetailEntity> {
    const evaluationExists = await this.evaluationRepository.findOne({
      where: { evaluationId: evaluationDetail.evaluationId },
    });
    if (!evaluationExists) {
      throw new NotFoundException(
        'La evaluación no existe, por favor verifique el ID de la evaluación',
      );
    }
    if (!evaluationExists.isOpen) {
      throw new ValidationException('La evaluación no se encuentra abierta');
    }
    if (evaluationExists.username !== username) {
      throw new ValidationException(
        'No tiene permiso para agregar detalles a esta evaluación',
      );
    }
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
    username: string,
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
    if (!existingEvaluationDetail) {
      throw new NotFoundException('Detalle de evaluación no encontrado');
    }
    if (existingEvaluationDetail.evaluation.username !== username) {
      throw new ValidationException(
        'No tiene permiso para actualizar este detalle de evaluación',
      );
    }
    if (!existingEvaluationDetail.evaluation.isOpen) {
      throw new ValidationException('La evaluación no se encuentra abierta');
    }
    return await this.evaluationDetailRepository.save(updatedEvaluationDetail);
  }

  async deleteEvaluationDetail(id: number, username: string): Promise<string> {
    const existingEvaluationDetail =
      await this.evaluationDetailRepository.findOne({
        where: { evaluationDetailId: id },
      });
    if (!existingEvaluationDetail) {
      throw new NotFoundException('No se encontró el detalle de evaluación');
    }
    if (existingEvaluationDetail.evaluation.username !== username) {
      throw new ValidationException(
        'No tiene permiso para eliminar este detalle de evaluación',
      );
    }
    if (!existingEvaluationDetail.evaluation.isOpen) {
      throw new ValidationException('La evaluación no se encuentra abierta');
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
