import { Inject, Injectable } from '@nestjs/common';
import { EVALUATION_DETAIL_SERVICE } from 'src/infraestructure/interface-provider';
import { EvaluationDetailsRepository } from 'src/infraestructure/repositories/evaluation-details-repository';
import { plainToInstance } from 'class-transformer';
import { EvaluationReportDto } from '../dto/responses/evaluation-report-dto';

@Injectable()
export class GetEvaluationsReports {
  constructor(
    @Inject(EVALUATION_DETAIL_SERVICE)
    private readonly evaluationDetailRepository: EvaluationDetailsRepository,
  ) {}

  async execute(): Promise<EvaluationReportDto[]> {
    const evaluationDetails =
      await this.evaluationDetailRepository.getAllEvaluationDetails();
    if (evaluationDetails.length === 0) {
      return [];
    }
    return evaluationDetails.map((evaluationDetail) => {
      return plainToInstance(EvaluationReportDto, {
        ...evaluationDetail,
        evaluationId: evaluationDetail.evaluation.evaluationId,
        referenceCode: evaluationDetail.evaluation.referenceCode,
        branchName: evaluationDetail.evaluation.branchName,
        managerName: evaluationDetail.evaluation.managerName,
        evaluatorName: evaluationDetail.evaluation.evaluatorName,
        areaId: evaluationDetail.area.areaId,
        areaName: evaluationDetail.area.description,
        categoryId: evaluationDetail.category.categoryId,
        categoryName: evaluationDetail.category.description,
        typeObservationId: evaluationDetail.typeObservation.typeObservationId,
        typeObservationName: evaluationDetail.typeObservation.description,
      });
    });
  }
}
