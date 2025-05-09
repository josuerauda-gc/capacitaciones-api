import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  public errors: string[];

  constructor(
    message: string = 'Recurso no encontrado',
    errors: string[] = [],
  ) {
    super(message, HttpStatus.NOT_FOUND);
    this.errors = [...errors];
  }
}
