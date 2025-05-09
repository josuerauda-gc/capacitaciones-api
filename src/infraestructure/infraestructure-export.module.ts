import { Module } from '@nestjs/common';
import { DatabaseContextModule } from './context/database-context.module';
import ConsulService from './services/consul/consul.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ENTITIES from 'src/application-core/domain/export-entity';

@Module({
  imports: [DatabaseContextModule, TypeOrmModule.forFeature(ENTITIES)],
  providers: [ConsulService],
  exports: [ConsulService],
})
export class InfraestructureExportModule {}
