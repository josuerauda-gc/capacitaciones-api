import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationDetailEntity } from 'src/application-core/domain/entities/evaluation-detail-entity';
import { EvaluationEntity } from 'src/application-core/domain/entities/evaluation-entity';
import { EvaluationDetailRequestDto } from 'src/application-core/dto/requests/evaluation-detail-dto';
import { NotFoundException } from 'src/application-core/exception/not-found-exception';
import { ValidationException } from 'src/application-core/exception/validation-exception';
import IEvaluationDetail from 'src/application-core/interfaces/i-evaluation-detail';
import { IFilters } from 'src/application-core/interfaces/i-filters';
import { Between, In, Repository } from 'typeorm';

@Injectable()
export class EvaluationDetailsRepository implements IEvaluationDetail {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
    @InjectRepository(EvaluationDetailEntity)
    private readonly evaluationDetailRepository: Repository<EvaluationDetailEntity>,
  ) {}

  async getAllEvaluationDetails(
    filters?: IFilters,
  ): Promise<EvaluationDetailEntity[]> {
    let whereFilter: any = {};
    if (filters) {
      if (filters.branches) {
        whereFilter.evaluation = { branchId: In(filters.branches) };
      }
      if (filters.areas) {
        whereFilter = {
          ...whereFilter,
          area: { areaId: In(filters.areas) },
        };
      }
      if (filters.categories) {
        whereFilter = {
          ...whereFilter,
          category: { categoryId: In(filters.categories) },
        };
      }
      if (filters.typesObservations) {
        whereFilter = {
          ...whereFilter,
          typeObservation: { typeObservationId: In(filters.typesObservations) },
        };
      }
      if (filters.date) {
        const date = new Date(filters.date);
        whereFilter.evaluation = {
          ...whereFilter.evaluation,
          date: Between(
            date, // 00:00:00 del día
            new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1), // 23:59:59 del mismo día
          ),
        };
      }
    }
    const evaluationDetails = await this.evaluationDetailRepository.find({
      relations: {
        evaluation: true,
        area: true,
        category: true,
        typeObservation: true,
      },
      where: whereFilter,
      order: { evaluationDetailId: 'DESC' },
    });
    return evaluationDetails;
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
      where: { referenceCode: evaluationDetail.evaluationReferenceCode },
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
    const newEvaluationDetail = await this.evaluationDetailRepository.save({
      evaluation: { evaluationId: evaluationExists.evaluationId },
      category: { nKey: evaluationDetail.categoryId },
      area: { nKey: evaluationDetail.areaId },
      typeObservation: {
        nKey: evaluationDetail.typeObservationId,
      },
      comments: evaluationDetail.comments,
    });
    return newEvaluationDetail;
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
    const evaluationDetailUpdated = await this.evaluationDetailRepository.save(
      updatedEvaluationDetail,
    );
    return evaluationDetailUpdated;
  }

  async deleteEvaluationDetail(id: number, username: string): Promise<string> {
    const existingEvaluationDetail =
      await this.evaluationDetailRepository.findOne({
        where: { evaluationDetailId: id },
        relations: {
          evaluation: true,
        },
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

  async getAllEvaluationDetailsByReferenceCode(
    referenceCode: string,
  ): Promise<EvaluationDetailEntity[]> {
    const evaluations = await this.evaluationDetailRepository.find({
      relations: {
        evaluation: true,
        area: true,
        category: true,
        typeObservation: true,
      },
      where: { evaluation: { referenceCode } },
    });
    return evaluations;
  }
}
