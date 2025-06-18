import { Module } from '@nestjs/common';
import { InfraestructureExportModule } from 'src/infraestructure/infraestructure-export.module';
import { GetAllAreas } from './use-cases/get-all-areas';
import { DatabaseContextModule } from 'src/infraestructure/context/database-context.module';
import { GetAllCategories } from './use-cases/get-all-categories';
import { GetAllTypesObservations } from './use-cases/get-all-types-observations';
import { GetAllEvaluations } from './use-cases/get-all-evaluations';
import { CreateEvaluation } from './use-cases/create-evaluation';
import { CloseEvaluation } from './use-cases/close-evaluation';
import { CreateEvaluationDetail } from './use-cases/create-evaluation-detail';
import { GetEvaluationDetailById } from './use-cases/get-evaluation-detail-by-id';
import { UpdateEvaluationDetail } from './use-cases/update-evaluation-detail';
import { DeleteEvaluationDetail } from './use-cases/delete-evaluation-detail';
import { GetEvaluationsReports } from './use-cases/get-evaluations-reports';
import { GetLastsEvaluations } from './use-cases/get-lasts-evaluations';
import { GetEvaluationByReferenceCode } from './use-cases/get-evaluation-by-reference-code';
import { GetAllEvaluationsByUsername } from './use-cases/get-all-evaluations-by-username';
import { DeleteEvaluationByReferenceCode } from './use-cases/delete-evaluation-by-reference-code';

@Module({
  imports: [DatabaseContextModule, InfraestructureExportModule],
  providers: [
    GetAllAreas,
    GetAllCategories,
    GetAllTypesObservations,
    GetAllEvaluations,
    GetAllEvaluationsByUsername,
    GetEvaluationByReferenceCode,
    CreateEvaluation,
    CloseEvaluation,
    DeleteEvaluationByReferenceCode,
    GetEvaluationDetailById,
    CreateEvaluationDetail,
    UpdateEvaluationDetail,
    DeleteEvaluationDetail,
    GetEvaluationsReports,
    GetLastsEvaluations,
  ],
  exports: [
    GetAllAreas,
    GetAllCategories,
    GetAllTypesObservations,
    GetAllEvaluations,
    GetAllEvaluationsByUsername,
    GetEvaluationByReferenceCode,
    CreateEvaluation,
    CloseEvaluation,
    DeleteEvaluationByReferenceCode,
    GetEvaluationDetailById,
    CreateEvaluationDetail,
    UpdateEvaluationDetail,
    DeleteEvaluationDetail,
    GetEvaluationsReports,
    GetLastsEvaluations,
  ],
})
export class ApplicationCoreExportModule { }
