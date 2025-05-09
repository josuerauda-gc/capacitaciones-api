import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  public errors: string[];

  constructor(
    message = 'Se obtuvieron uno o mas errores de validacion',
    errors: string[] = [],
  ) {
    super(message, HttpStatus.BAD_REQUEST);
    this.errors = [...errors];
  }
}
