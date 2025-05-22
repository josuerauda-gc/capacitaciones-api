import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationEntity } from 'src/application-core/domain/entities/evaluation-entity';
import { CloseEvaluationDto } from 'src/application-core/dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from 'src/application-core/dto/requests/evaluation-dto';
import { NotFoundException } from 'src/application-core/exception/not-found-exception';
import { ValidationException } from 'src/application-core/exception/validation-exception';
import IEvaluation from 'src/application-core/interfaces/i-evaluation';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EvaluationRepository implements IEvaluation {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
  ) {}

  async getAllEvaluations(): Promise<EvaluationEntity[]> {
    return await this.evaluationRepository.find({
      order: { date: 'DESC' },
    });
  }

  async getEvaluationById(id: number): Promise<EvaluationEntity> {
    return await this.evaluationRepository.findOne({
      where: { evaluationId: id },
    });
  }

  async saveEvaluation(
    evaluation: EvaluationRequestDto,
  ): Promise<EvaluationEntity> {
    const referenceCode = uuidv4().replace(/-/g, '').substring(0, 20);
    const existingEvaluation = await this.evaluationRepository.findOne({
      where: {
        branchId: evaluation.branchId,
      },
    });
    if (existingEvaluation) {
      throw new ValidationException(
        'Ya existe una evaluación activa para esta sucursal',
      );
    }
    const newEvaluation: EvaluationEntity = {
      evaluationId: null,
      referenceCode,
      date: new Date(),
      isOpen: true,
      ...evaluation,
      comments: evaluation.comments ? evaluation.comments : '',
    };
    return await this.evaluationRepository.save(newEvaluation);
  }

  async updateEvaluation(
    id: number,
    evaluation: EvaluationRequestDto,
  ): Promise<EvaluationEntity> {
    const existingEvaluation = await this.evaluationRepository.findOne({
      where: { evaluationId: id },
    });
    if (!existingEvaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    const updatedEvaluation = {
      ...existingEvaluation,
      ...evaluation,
    };
    return await this.evaluationRepository.save(updatedEvaluation);
  }

  async closeEvaluation(
    id: number,
    evaluationClose: CloseEvaluationDto,
  ): Promise<EvaluationEntity> {
    const existingEvaluation = await this.evaluationRepository.findOne({
      where: { evaluationId: id },
    });
    if (!existingEvaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    if (!existingEvaluation.isOpen) {
      throw new ValidationException('La evaluación ya está cerrada');
    }
    const updatedEvaluation = {
      ...existingEvaluation,
      ...evaluationClose,
      isOpen: false,
    };
    return await this.evaluationRepository.save(updatedEvaluation);
  }

  // async deleteEvaluation(id: number): Promise<string> {
  //   const existingEvaluation = await this.evaluationRepository.findOne({
  //     where: { evaluationId: id },
  //   });
  //   if (!existingEvaluation) {
  //     throw new NotFoundException('Evaluation no encontrada');
  //   }
  //   await this.evaluationRepository.delete(id);
  //   return 'Evaluación eliminada correctamente';
  // }
}
