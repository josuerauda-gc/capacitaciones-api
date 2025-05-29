export interface AxiosResponse {
  success: boolean;
  message: string;
  errors: Array<string> | null;
  data: Object | null | any;
}
