import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EvaluationDetailRequestDto } from 'src/application-core/dto/requests/evaluation-detail-dto';
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
  async getEvaluationDetailByIdHandler(
    @Param('evaluationDetailId') evaluationDetailId: number,
  ) {
    return await this.getEvaluationDetailById.execute(evaluationDetailId);
  }

  @Post()
  async createEvaluationDetailHandler(
    @Body() evaluationDetailDto: EvaluationDetailRequestDto,
  ) {
    return await this.createEvaluationDetail.execute(evaluationDetailDto);
  }

  @Put(':evaluationDetailId')
  async updateEvaluationDetailHandler(
    @Param('evaluationDetailId') evaluationDetailId: number,
    @Body() evaluationDetailDto: EvaluationDetailRequestDto,
  ) {
    return await this.updateEvaluationDetail.execute(
      evaluationDetailId,
      evaluationDetailDto,
    );
  }

  @Delete(':evaluationDetailId')
  async deleteEvaluationDetailHandler(
    @Param('evaluationDetailId') evaluationDetailId: number,
  ) {
    return await this.deleteEvaluationDetail.execute(evaluationDetailId);
  }
}
