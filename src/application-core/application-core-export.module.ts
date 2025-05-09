import { Module } from '@nestjs/common';
import { InfraestructureExportModule } from 'src/infraestructure/infraestructure-export.module';

@Module({
  imports: [InfraestructureExportModule],
})
export class ApplicationCoreExportModule {}
