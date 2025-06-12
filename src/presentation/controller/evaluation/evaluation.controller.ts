import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CloseEvaluationDto } from 'src/application-core/dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from 'src/application-core/dto/requests/evaluation-dto';
import { EvaluationResponseDto } from 'src/application-core/dto/responses/evaluation-dto';
import { EvaluationReportDto } from 'src/application-core/dto/responses/evaluation-report-dto';
import { ValidationException } from 'src/application-core/exception/validation-exception';
import { IFilters } from 'src/application-core/interfaces/i-filters';
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
  async getAllEvaluations(
    @Query('from') from?: number,
    @Query('to') to?: number,
  ) {
    if (from && isNaN(from)) {
      throw new ValidationException('El parámetro desde debe ser un número');
    }
    if (to && isNaN(to)) {
      throw new ValidationException('El parámetro hasta debe ser un número');
    }
    return await this.getAllEvaluationsUseCase.execute(from, to);
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
  async getAllEvaluationsReports(
    @Query('branch') branch?: string,
    @Query('category') category?: number,
    @Query('area') area?: number,
    @Query('typeObservation') typeObservation?: number,
    @Query('date') date?: string,
  ) {
    if (branch && branch.match(/^[a-zA-Z0-9\s]+$/) === null) {
      throw new ValidationException(
        'El parámetro sucursal debe contener solo letras y números',
      );
    }
    if (area && isNaN(area)) {
      throw new ValidationException('El parámetro area debe ser un número');
    }
    if (typeObservation && isNaN(typeObservation)) {
      throw new ValidationException(
        'El parámetro tipo de observación debe ser un número',
      );
    }
    if (!date) {
      throw new ValidationException(
        'El parámetro fecha es obligatorio y debe ser una fecha válida (YYYY-MM-DD)',
      );
    }
    if (date && date.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
      throw new ValidationException(
        'El parámetro fecha debe ser una fecha válida (YYYY-MM-DD)',
      );
    }
    const dateParsed = date ? new Date(date) : new Date();
    const filters: IFilters = {
      branch: branch ? branch : null,
      category: category ? Number(category) : null,
      area: area ? Number(area) : null,
      typeObservation: typeObservation ? Number(typeObservation) : null,
      date: date ? dateParsed : new Date(),
    };
    return await this.getEvaluationsReports.execute(filters);
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
      throw new ValidationException('Token no ha sido transmitido');
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
      throw new ValidationException('Token no ha sido transmitido');
    }
    const token = authorization.split(' ')[1];
    return await this.closeEvaluation.execute(
      referenceCode,
      closeEvaluationDto,
      token,
    );
  }
}
