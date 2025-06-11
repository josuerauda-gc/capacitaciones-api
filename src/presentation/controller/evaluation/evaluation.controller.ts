import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CloseEvaluationDto } from 'src/application-core/dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from 'src/application-core/dto/requests/evaluation-dto';
import { EvaluationResponseDto } from 'src/application-core/dto/responses/evaluation-dto';
import { EvaluationReportDto } from 'src/application-core/dto/responses/evaluation-report-dto';
import { ValidationException } from 'src/application-core/exception/validation-exception';
import { CloseEvaluation } from 'src/application-core/use-cases/close-evaluation';
import { CreateEvaluation } from 'src/application-core/use-cases/create-evaluation';
import { GetAllEvaluations } from 'src/application-core/use-cases/get-all-evaluations';
import { GetAllEvaluationsByUsername } from 'src/application-core/use-cases/get-all-evaluations-by-username';
import { GetEvaluationByReferenceCode } from 'src/application-core/use-cases/get-evaluation-by-reference-code';
import { GetEvaluationsReports } from 'src/application-core/use-cases/get-evaluations-reports';
import { GetLastsEvaluations } from 'src/application-core/use-cases/get-lasts-evaluations';

@Controller('evaluations')
export class EvaluationController {
  constructor(
    private readonly getAllEvaluationsUseCase: GetAllEvaluations,
    private readonly getEvaluationByReferenceCode: GetEvaluationByReferenceCode,
    private readonly createEvaluation: CreateEvaluation,
    private readonly closeEvaluation: CloseEvaluation,
    private readonly getEvaluationsReports: GetEvaluationsReports,
    private readonly getLastEvaluationsBranch: GetLastsEvaluations,
    private readonly getAllEvaluationsByUsername: GetAllEvaluationsByUsername,
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

  @Get(':referenceCode')
  @ApiResponse({
    status: 200,
    description: 'Obtener evaluación por código de referencia',
    type: EvaluationResponseDto,
  })
  async getEvaluationByIdHandler(
    @Param('referenceCode') referenceCode: string,
  ) {
    return await this.getEvaluationByReferenceCode.execute(referenceCode);
  }

  @Get('/user/:username')
  @ApiResponse({
    status: 200,
    description: 'Obtener evaluaciones por nombre de usuario',
    type: EvaluationResponseDto,
  })
  async getEvaluationsByUsername(@Param('username') username: string) {
    return await this.getAllEvaluationsByUsername.execute(username);
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

  @Post('close/:referenceCode')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Evaluación cerrada exitosamente',
    type: EvaluationResponseDto,
  })
  async closeEvaluationHandler(
    @Headers('authorization') authorization: string,
    @Param('referenceCode') referenceCode: string,
    @Body() closeEvaluationDto: CloseEvaluationDto,
  ) {
    if (!authorization) {
      throw new ValidationException('Authorization header is required');
    }
    const token = authorization.split(' ')[1];
    return await this.closeEvaluation.execute(
      referenceCode,
      closeEvaluationDto,
      token,
    );
  }
}
