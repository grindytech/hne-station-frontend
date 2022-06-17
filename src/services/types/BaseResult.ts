export interface BaseResult<T> {
  errors: object;
  data: T;
  success: boolean;
}
