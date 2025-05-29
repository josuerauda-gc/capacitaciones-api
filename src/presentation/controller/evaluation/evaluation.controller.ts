import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CloseEvaluationDto } from 'src/application-core/dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from 'src/application-core/dto/requests/evaluation-dto';
import { EvaluationResponseDto } from 'src/application-core/dto/responses/evaluation-dto';
import { EvaluationReportDto } from 'src/application-core/dto/responses/evaluation-report-dto';
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
  @ApiResponse({
    status: 200,
    description: 'Listado de evaluaciones',
    type: EvaluationResponseDto,
  })
  async getAllEvaluations() {
    return await this.getAllEvaluationsUseCase.execute();
  }

  @Get('lasts')
  @ApiResponse({
    status: 200,
    description: 'Listado de últimas evaluaciones de cada sucursal',
    type: EvaluationResponseDto,
  })
  async getLastsEvaluations() {
    return await this.getLastEvaluationsBranch.execute();
  }

  @Get('reports')
  @ApiResponse({
    status: 200,
    description: 'Listado de evaluaciones',
    type: EvaluationReportDto,
  })
  async getAllEvaluationsReports() {
    return await this.getEvaluationsReports.execute();
  }

  @Get(':evaluationId')
  @ApiResponse({
    status: 200,
    description: 'Obtener evaluación por ID',
    type: EvaluationResponseDto,
  })
  async getEvaluationByIdHandler(@Param('evaluationId') evaluationId: number) {
    return await this.getEvaluationById.execute(evaluationId);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
    type: EvaluationResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Evaluación cerrada exitosamente',
    type: EvaluationResponseDto,
  })
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
