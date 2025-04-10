export class RequestOptions {
  queryParams?: { [key: string]: string | number | boolean; } | URLSearchParams | undefined
  multiPartData?: boolean
  data?: { [key: string]: string | number | boolean; }
}