import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { CloseEvaluationDto } from 'src/application-core/dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from 'src/application-core/dto/requests/evaluation-dto';
import { ValidationException } from 'src/application-core/exception/validation-exception';
import { CloseEvaluation } from 'src/application-core/use-cases/close-evaluation';
import { CreateEvaluation } from 'src/application-core/use-cases/create-evaluation';
import { GetAllEvaluations } from 'src/application-core/use-cases/get-all-evaluations';
import { GetEvaluationById } from 'src/application-core/use-cases/get-evaluation-by-id';
import { GetEvaluationsReports } from 'src/application-core/use-cases/get-evaluations-reports';
import { GetLastsEvaluations } from 'src/application-core/use-cases/get-lasts-evaluations';

@Controller('evaluations')
export class EvaluationController {
  constructor(
    private readonly getAllEvaluationsUseCase: GetAllEvaluations,
    private readonly getEvaluationById: GetEvaluationById,
    private readonly createEvaluation: CreateEvaluation,
    private readonly closeEvaluation: CloseEvaluation,
    private readonly getEvaluationsReports: GetEvaluationsReports,
    private readonly getLastEvaluationsBranch: GetLastsEvaluations,
  ) {}

  @Get()
  async getAllEvaluations() {
    return await this.getAllEvaluationsUseCase.execute();
  }

  @Get('lasts')
  async getLastsEvaluations() {
    return await this.getLastEvaluationsBranch.execute();
  }

  @Get('reports')
  async getAllEvaluationsReports() {
    return await this.getEvaluationsReports.execute();
  }

  @Get(':evaluationId')
  async getEvaluationByIdHandler(@Param('evaluationId') evaluationId: number) {
    return await this.getEvaluationById.execute(evaluationId);
  }

  @Post()
  async saveEvaluation(
    @Headers('authorization') authorization: string,
    @Body() evaluationDto: EvaluationRequestDto,
  ) {
    if (!authorization) {
      throw new ValidationException('Authorization header is required');
    }
    const token = authorization.split(' ')[1];
    return await this.createEvaluation.execute(evaluationDto, token);
  }

  @Post('close/:evaluationId')
  async closeEvaluationHandler(
    @Headers('authorization') authorization: string,
    @Param('evaluationId') evaluationId: number,
    @Body() closeEvaluationDto: CloseEvaluationDto,
  ) {
    if (!authorization) {
      throw new ValidationException('Authorization header is required');
    }
    const token = authorization.split(' ')[1];
    return await this.closeEvaluation.execute(
      evaluationId,
      closeEvaluationDto,
      token,
    );
  }
}
