import { HttpException, HttpStatus } from '@nestjs/common';

export default class NotAuthorizedException extends HttpException {
  public errors: string[];

  constructor(
    message: string = 'No tienes autorizacion a este recurso',
    errors: string[] = [],
  ) {
    super(message, HttpStatus.FORBIDDEN);
    this.errors = [...errors];
  }
}
