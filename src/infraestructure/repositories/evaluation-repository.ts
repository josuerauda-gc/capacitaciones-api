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

  async getAllEvaluations(
    from: number = 0,
    to?: number,
  ): Promise<EvaluationEntity[]> {
    let evaluations: EvaluationEntity[] = [];
    if (to) {
      evaluations = await this.evaluationRepository.find({
        order: { date: 'DESC' },
        take: to - from,
        skip: from,
      });
    } else {
      evaluations = await this.evaluationRepository.find({
        order: { date: 'DESC' },
        skip: from,
      });
    }
    return evaluations;
  }

  async getEvaluationById(evaluationId: number): Promise<EvaluationEntity> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { evaluationId: evaluationId },
    });
    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    return evaluation;
  }

  async getEvaluationByReferenceCode(
    referenceCode: string,
  ): Promise<EvaluationEntity> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { referenceCode: referenceCode },
    });
    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    return evaluation;
  }

  async getEvaluationsByUsername(
    username: string,
  ): Promise<EvaluationEntity[]> {
    const evaluations = await this.evaluationRepository.find({
      where: { username: username },
      take: process.env.TOP_LIST ? parseInt(process.env.TOP_LIST) : 10,
      order: { date: 'DESC' },
    });
    return evaluations;
  }

  async saveEvaluation(
    evaluation: EvaluationRequestDto,
    username: string,
  ): Promise<EvaluationEntity> {
    const referenceCode = uuidv4().replace(/-/g, '').substring(0, 20);
    const existingEvaluation = await this.evaluationRepository.findOne({
      where: {
        branchId: evaluation.branchId,
        isOpen: true,
      },
    });
    if (existingEvaluation) {
      throw new ValidationException(
        'Ya existe una evaluación activa para esta sucursal',
      );
    }
    const userHasAnOpenEvaluation = await this.evaluationRepository.findOne({
      where: { username: username, isOpen: true },
    });
    if (userHasAnOpenEvaluation) {
      throw new ValidationException(
        'Ya tienes una evaluación abierta, por favor cierra la evaluación actual antes de crear una nueva.',
      );
    }
    const newEvaluation: EvaluationEntity = {
      evaluationId: null,
      date: new Date(),
      referenceCode,
      isOpen: true,
      username,
      ...evaluation,
      managerName: evaluation.managerName ? evaluation.managerName : '',
      comments: evaluation.comments ? evaluation.comments : '',
    };
    return await this.evaluationRepository.save(newEvaluation);
  }

  async updateEvaluation(
    referenceCode: string,
    evaluation: EvaluationRequestDto,
  ): Promise<EvaluationEntity> {
    const existingEvaluation = await this.evaluationRepository.findOne({
      where: { referenceCode },
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
    referenceCode: string,
    evaluationClose: CloseEvaluationDto,
    username: string,
  ): Promise<EvaluationEntity> {
    const existingEvaluation = await this.evaluationRepository.findOne({
      where: { referenceCode },
    });
    if (!existingEvaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    if (username !== existingEvaluation.username) {
      throw new ValidationException(
        'No tienes permiso para cerrar esta evaluación',
      );
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
