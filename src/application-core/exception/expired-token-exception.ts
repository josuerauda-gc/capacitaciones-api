export class ExpiredTokenException extends Error {
  constructor(public errors?: string[] | Array<any>) {
    super('token Expirado');
    this.name = 'ExpiredTokenException';
    if (!errors) {
      this.errors = [];
    }
  }
}
