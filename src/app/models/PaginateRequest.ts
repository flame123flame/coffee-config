export class PaginateRequest {
  page: number = 0;
  length: number = 25;
  sort: PaginateSort[] = [];
  filter: PaginateFilter[] = [];

  constructor(config = null) {
    if (config) {
      config.page ? this.page = config.page : null;
      config.length ? this.length = config.length : null;
      config.sort ? this.sort = config.sort : null;
      config.filter ? this.filter = config.filter : null;

    }
  }
}

export class PaginateFilter {
  column: string;
  op: FilterOp | string;
  value: string | Date;
  value1?: string | Date;
}

export class PaginateSort {
  column: string;
  order: string;
}

export enum FilterOp {
  EQUAL = '=',
  MORE_EQUAL = '>=',
  LESS_EQUAL = '<=',
  MORE = '>',
  LESS = '<',
  START_WITH = 'startWith',
  END_WITH = 'endWith',
  CONTAIN = 'contain',
  BETWEEN = 'between'
}
