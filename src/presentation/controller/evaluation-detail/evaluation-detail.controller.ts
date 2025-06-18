import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { EvaluationDetailRequestDto } from 'src/application-core/dto/requests/evaluation-detail-dto';
import { EvaluationDetailResponseDto } from 'src/application-core/dto/responses/evaluation-detail-dto';
import { ValidationException } from 'src/application-core/exception/validation-exception';
import { CreateEvaluationDetail } from 'src/application-core/use-cases/create-evaluation-detail';
import { DeleteEvaluationDetail } from 'src/application-core/use-cases/delete-evaluation-detail';
import { GetEvaluationDetailById } from 'src/application-core/use-cases/get-evaluation-detail-by-id';
import { UpdateEvaluationDetail } from 'src/application-core/use-cases/update-evaluation-detail';

@Controller('evaluation-details')
export class EvaluationDetailController {
  constructor(
    private readonly createEvaluationDetail: CreateEvaluationDetail,
    private readonly getEvaluationDetailById: GetEvaluationDetailById,
    private readonly updateEvaluationDetail: UpdateEvaluationDetail,
    private readonly deleteEvaluationDetail: DeleteEvaluationDetail,
  ) {}

  @Get(':evaluationDetailId')
  @ApiResponse({
    status: 200,
    description: 'Obtener detalle de evaluación por ID',
    type: EvaluationDetailResponseDto,
  })
  async getEvaluationDetailByIdHandler(
    @Param('evaluationDetailId') evaluationDetailId: number,
  ) {
    return await this.getEvaluationDetailById.execute(evaluationDetailId);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Detalle de evaluación creado exitosamente',
    type: EvaluationDetailResponseDto,
  })
  async createEvaluationDetailHandler(
    @Headers('authorization') authorization: string,
    @Body() evaluationDetailDto: EvaluationDetailRequestDto,
  ) {
    if (!authorization) {
      throw new ValidationException('Token no ha sido transmitido');
    }
    const token = authorization.split(' ')[1];
    return await this.createEvaluationDetail.execute(
      evaluationDetailDto,
      token,
    );
  }

  @Put(':evaluationDetailId')
  @ApiResponse({
    status: 200,
    description: 'Detalle de evaluación actualizado exitosamente',
    type: EvaluationDetailResponseDto,
  })
  async updateEvaluationDetailHandler(
    @Headers('authorization') authorization: string,
    @Param('evaluationDetailId') evaluationDetailId: number,
    @Body() evaluationDetailDto: EvaluationDetailRequestDto,
  ) {
    if (isNaN(evaluationDetailId)) {
      throw new ValidationException(
        'No se ha específicado un ID de detalle de evaluación válido',
      );
    }
    if (!authorization) {
      throw new ValidationException('Token no ha sido transmitido');
    }
    const token = authorization.split(' ')[1];
    return await this.updateEvaluationDetail.execute(
      evaluationDetailId,
      evaluationDetailDto,
      token,
    );
  }

  @Delete(':evaluationDetailId')
  @ApiResponse({
    status: 200,
    description: 'Detalle de evaluación eliminado exitosamente',
    type: EvaluationDetailResponseDto,
  })
  async deleteEvaluationDetailHandler(
    @Headers('authorization') authorization: string,
    @Param('evaluationDetailId') evaluationDetailId: number,
  ) {
    if (isNaN(evaluationDetailId)) {
      throw new ValidationException(
        'No se ha específicado un ID de detalle de evaluación válido',
      );
    }
    if (!authorization) {
      throw new ValidationException('Token no ha sido transmitido');
    }
    const token = authorization.split(' ')[1];
    return await this.deleteEvaluationDetail.execute(evaluationDetailId, token);
  }
}
