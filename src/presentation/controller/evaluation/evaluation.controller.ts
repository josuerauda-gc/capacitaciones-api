import {
  Body,
  Controller,
  Delete,
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
import { DeleteEvaluationByReferenceCode } from 'src/application-core/use-cases/delete-evaluation-by-reference-code';
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
    private readonly deleteEvaluationByReferenceCode: DeleteEvaluationByReferenceCode,
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
    @Query('category') category?: string,
    @Query('area') area?: string,
    @Query('typeObservation') typeObservation?: string,
    @Query('date') date?: string,
  ) {
    let branches = [];
    let areas = [];
    let categories = [];
    let typesObservations = [];
    if (branch) {
      branches = branch.split(',').map((b) => Number(b.trim()));
      if (branches.some((b) => isNaN(b))) {
        throw new ValidationException(
          'El parámetro sucursal debe ser un número y separados por comas',
        );
      }
    }
    if (area) {
      areas = area.split(',').map((a) => Number(a.trim()));
      if (areas.some((a) => isNaN(a))) {
        throw new ValidationException(
          'El parámetro area debe ser un número y separados por comas',
        );
      }
    }
    if (category) {
      categories = category.split(',').map((c) => Number(c.trim()));
      if (categories.some((c) => isNaN(c))) {
        throw new ValidationException(
          'El parámetro categoría debe ser un número y separados por comas',
        );
      }
    }
    if (typeObservation) {
      typesObservations = typeObservation
        .split(',')
        .map((t) => Number(t.trim()));
      if (typesObservations.some((t) => isNaN(t))) {
        throw new ValidationException(
          'El parámetro tipo de observación debe ser un número y separados por comas',
        );
      }
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
      branches: branch ? branches : null,
      categories: category ? categories : null,
      areas: area ? areas : null,
      typesObservations: typeObservation ? typesObservations : null,
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
    if (!referenceCode) {
      throw new ValidationException(
        'No se ha específicado un código de referencia válido',
      );
    }
    return await this.getEvaluationByReferenceCode.execute(referenceCode);
  }

  @Get('/user/:username')
  @ApiResponse({
    status: 200,
    description: 'Obtener evaluaciones por nombre de usuario',
    type: EvaluationResponseDto,
  })
  async getEvaluationsByUsername(@Param('username') username: string) {
    if (!username) {
      throw new ValidationException(
        'No se ha específicado un nombre de usuario válido',
      );
    }
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
    if (!referenceCode) {
      throw new ValidationException(
        'El código de referencia es obligatorio para cerrar la evaluación',
      );
    }
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

  @Delete(':referenceCode')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Evaluación eliminada exitosamente',
  })
  async deleteEvaluationHandler(
    @Headers('authorization') authorization: string,
    @Param('referenceCode') referenceCode: string,
  ) {
    if (!referenceCode) {
      throw new ValidationException(
        'No se ha específicado un código de referencia válido',
      );
    }
    if (!authorization) {
      throw new ValidationException('Token no ha sido transmitido');
    }
    const token = authorization.split(' ')[1];
    return await this.deleteEvaluationByReferenceCode.execute(
      referenceCode,
      token,
    );
  }
}
