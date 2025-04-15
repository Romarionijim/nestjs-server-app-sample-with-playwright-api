export class RequestOptions<T> {
  queryParams?: { [key: string]: string | number | boolean; };
  multiPartData?: boolean;
  data?: T;
  isAuthRequired?: boolean;
  shouldRegisterFirst?: boolean;
}