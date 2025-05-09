export default class GlobalResponse {
  public success: boolean;
  public message: string;
  public errors: string[];
  public data: any;

  constructor(
    data: any,
    message: string,
    errors: string[],
    success: boolean = true,
  ) {
    this.success = success;
    this.message = message;
    this.errors = errors;
    this.data = data;
  }
}
