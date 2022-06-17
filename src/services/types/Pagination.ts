export interface Pagination<T> {
  total: number;

  currentPage: number;

  size: number;

  pages: number;

  hasNext: boolean;

  hasPrevious: boolean;

  items: T[];
}
