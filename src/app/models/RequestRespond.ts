export interface RequestRespond<T> {
  status: string;
  message: string;
  data: T;
}

export interface RequestPaginateRespond<T> {
  status: string;
  message: string;
  data: PaginateRespond<T>;
}

export interface PaginateRespond<T> {
  draw: number;
  recordsTotal: number;
  page: number;
  data: T[];
}
