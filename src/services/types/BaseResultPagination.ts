import { Pagination } from "./Pagination";

export interface BaseResultPagination<T> {
  errors: Record<string, string[]>;
  data: Pagination<T>;
  success: boolean;
}
