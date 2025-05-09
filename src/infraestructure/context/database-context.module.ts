import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ENTITIES from 'src/application-core/domain/export-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA,
      entities: ENTITIES,
      synchronize: false,
    }),
  ],
})
export class DatabaseContextModule { }
