import { HttpException, HttpStatus } from '@nestjs/common';

export default class InternalException extends HttpException {
  public errors: string[];

  constructor(
    message: string = 'Ocurrio un error interno',
    errors: string[] = [],
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.errors = [...errors];
  }
}
