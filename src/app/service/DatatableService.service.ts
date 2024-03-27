import { Injectable } from '@angular/core';
@Injectable()
export class DatatableService {
  public static setEmptyData(data:any[]) {
    data.forEach(element => {
      for (const key in element) {
        element[key] = element[key]?element[key]:'-';
      }
    });
    return data
  }
}
