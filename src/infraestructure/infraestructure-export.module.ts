import { Module } from '@nestjs/common';
import { DatabaseContextModule } from './context/database-context.module';
import ConsulService from './services/consul/consul.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebdavService } from './services/webdav/webdav.service';
import { Base64ConverterService } from './services/base64-converter/base64-converter.service';
import ENTITIES from 'src/application-core/domain/export-entity';
import {
  AREA_SERVICE,
  CATEGORY_SERVICE,
  EVALUATION_DETAIL_SERVICE,
  EVALUATION_IMAGE_SERVICE,
  EVALUATION_SERVICE,
  TYPE_OBSERVATION_SERVICE,
} from './interface-provider';
import { AreaRepository } from './repositories/area-repository';
import { CategoryRepository } from './repositories/category-repository';
import { TypeObservationRepository } from './repositories/type-observation-repository';
import { EvaluationRepository } from './repositories/evaluation-repository';
import { EvaluationDetailsRepository } from './repositories/evaluation-details-repository';
import { EvaluationImageRepository } from './repositories/evaluation-image-repository';
import SecurityService from './services/security/security.service';

@Module({
  imports: [DatabaseContextModule, TypeOrmModule.forFeature(ENTITIES)],
  providers: [
    ConsulService,
    WebdavService,
    Base64ConverterService,
    {
      provide: AREA_SERVICE,
      useClass: AreaRepository,
    },
    {
      provide: CATEGORY_SERVICE,
      useClass: CategoryRepository,
    },
    {
      provide: TYPE_OBSERVATION_SERVICE,
      useClass: TypeObservationRepository,
    },
    {
      provide: EVALUATION_SERVICE,
      useClass: EvaluationRepository,
    },
    {
      provide: EVALUATION_DETAIL_SERVICE,
      useClass: EvaluationDetailsRepository,
    },
    {
      provide: EVALUATION_IMAGE_SERVICE,
      useClass: EvaluationImageRepository,
    },
    SecurityService,
  ],
  exports: [
    ConsulService,
    WebdavService,
    Base64ConverterService,
    SecurityService,
    AREA_SERVICE,
    CATEGORY_SERVICE,
    TYPE_OBSERVATION_SERVICE,
    EVALUATION_SERVICE,
    EVALUATION_DETAIL_SERVICE,
    EVALUATION_IMAGE_SERVICE,
  ],
})
export class InfraestructureExportModule {}
