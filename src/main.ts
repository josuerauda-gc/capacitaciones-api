import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ErrorHandlerMiddlerware from './presentation/middleware/error-handler-middleware';
import GlobalResponse from './application-core/wrapper/global-response';
import GlobalResponseMiddleware from './presentation/middleware/global-response-middleware';
import { ValidationException } from './application-core/exception/validation-exception';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENVIRONMENT_DATA } from './application-core/interfaces/i-consul';
import ConsulService from './infraestructure/services/consul/consul.service';
import { formatValidationErrors } from './infraestructure/utils/format-validation-errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ allowedHeaders: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.log(
          `Inicio del mensaje de error de validación - ${new Date()}`,
        );
        const messages = formatValidationErrors(errors);
        console.log(messages);
        console.log('Fin del mensaje de error de validación');
        throw new ValidationException('Errores de validación', messages);
      },
    }),
  );
  app.useGlobalFilters(new ErrorHandlerMiddlerware());
  //agregamos el middleware de errores globales
  app.useGlobalInterceptors(new GlobalResponseMiddleware());
  const config = new DocumentBuilder()
    .setTitle('API de Capacitaciones Grupo Campestre')
    .setDescription(
      'API para distintas funciones que componen a la app web de Capacitaciones de Grupo Campestre',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const consul = app.get<ConsulService>(ConsulService);
  const consulData = ENVIRONMENT_DATA.consul;
  await consul.RegisterService(consulData);
  await app.listen(process.env.APP_PORT || 3000, () => {
    console.log(
      `Servidor escuchando en puerto ${process.env.APP_PORT || 3000} 🚀`,
    );
  });
}
bootstrap();
