import { Module } from '@nestjs/common';
import { InfraestructureExportModule } from './infraestructure/infraestructure-export.module';
import { ApplicationCoreExportModule } from './application-core/application-core-export.module';
import { HealthController } from './presentation/controller/health/health.controller';
import { AreaController } from './presentation/controller/area/area.controller';
import { CategoryController } from './presentation/controller/category/category.controller';
import { TypesObservationsController } from './presentation/controller/types-observations/types-observations.controller';
import { EvaluationController } from './presentation/controller/evaluation/evaluation.controller';
import { EvaluationDetailController } from './presentation/controller/evaluation-detail/evaluation-detail.controller';

@Module({
  imports: [ApplicationCoreExportModule, InfraestructureExportModule],
  controllers: [
    HealthController,
    AreaController,
    CategoryController,
    TypesObservationsController,
    EvaluationController,
    EvaluationDetailController,
  ],
})
export class AppModule {}
