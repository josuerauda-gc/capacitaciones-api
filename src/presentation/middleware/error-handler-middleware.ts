import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import GlobalResponse from 'src/application-core/wrapper/global-response';

interface ErrorData {
  message: string;
  errors: string[];
}

@Catch()
export default class ErrorHandlerMiddlerware implements ExceptionFilter {
  private readonly exceptionMessages: {
    [key: string]: (exception: any) => ErrorData;
  } = {
    InternalException: (exception: any) => ({
      message: exception.message,
      errors: exception?.errors,
    }),
    NotAuthorizedException: (exception: any) => ({
      message: exception.message,
      errors: exception?.errors,
    }),
    NotFoundException: (exception: any) => ({
      message: exception.message,
      errors: exception?.errors,
    }),
    ValidationException: (exception: any) => ({
      message: exception.message,
      errors: exception?.errors,
    }),
    unknown: (exception: any) => ({
      message: 'Ocurrio un problema en el servidor',
      errors: [exception.message],
    }),
  }; // listado de excepciones registradas

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionType: string =
      exception instanceof HttpException ? exception.name.trim() : 'unknown';
    const errorResponse: ErrorData = this.exceptionMessages[exceptionType]
      ? this.exceptionMessages[exceptionType](exception)
      : this.exceptionMessages['unknown'](exception);

    response
      .status(status)
      .json(
        new GlobalResponse(
          null,
          errorResponse.message,
          errorResponse.errors,
          false,
        ),
      );
  }
}
