export interface PageChangeModel {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeModel {
  active: string;
  direction: string;
}
