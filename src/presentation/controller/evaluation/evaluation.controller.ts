import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CloseEvaluationDto } from 'src/application-core/dto/requests/close-evaluation-dto';
import { EvaluationRequestDto } from 'src/application-core/dto/requests/evaluation-dto';
import { CloseEvaluation } from 'src/application-core/use-cases/close-evaluation';
import { CreateEvaluation } from 'src/application-core/use-cases/create-evaluation';
import { GetAllEvaluations } from 'src/application-core/use-cases/get-all-evaluations';
import { GetEvaluationById } from 'src/application-core/use-cases/get-evaluation-by-id';

@Controller('evaluations')
export class EvaluationController {
  constructor(
    private readonly getAllEvaluationsUseCase: GetAllEvaluations,
    private readonly getEvaluationById: GetEvaluationById,
    private readonly createEvaluation: CreateEvaluation,
    private readonly closeEvaluation: CloseEvaluation,
  ) {}

  @Get()
  async getAllEvaluations() {
    return await this.getAllEvaluationsUseCase.execute();
  }

  @Get(':evaluationId')
  async getEvaluationByIdHandler(@Param('evaluationId') evaluationId: number) {
    return await this.getEvaluationById.execute(evaluationId);
  }

  @Post()
  async saveEvaluation(@Body() evaluationDto: EvaluationRequestDto) {
    console.log(evaluationDto);
    return await this.createEvaluation.execute(evaluationDto);
  }

  @Post('close/:evaluationId')
  async closeEvaluationHandler(
    @Param('evaluationId') evaluationId: number,
    @Body() closeEvaluationDto: CloseEvaluationDto,
  ) {
    return await this.closeEvaluation.execute(evaluationId, closeEvaluationDto);
  }
}
