import { Injectable } from '@angular/core';
@Injectable()
export class MatDatePickerService {
  public static DateOption = {
    START_OF_DAY: 'START_OF_DAY',
    END_OF_DAY: 'END_OF_DAY'
  }
  public static fixDateReduceOneDay(date: Date, optionDate?) {
    var nextDate = new Date(date);
    var dateValue = date.getDate() + 1;
    nextDate.setDate(dateValue);
    if (optionDate) {
      this.optionDate(optionDate,nextDate)
    }

    return nextDate;
  }

  public static setTimeToStartOfDay(date: Date) {
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
  }
  public static setTimeToEndOfDay(date: Date) {
    date.setUTCHours(23);
    date.setUTCMinutes(59);
    date.setUTCSeconds(59);
  }

  private static optionDate(optionDate,date:Date) {
    if (optionDate === this.DateOption.START_OF_DAY) {
      this.setTimeToStartOfDay(date)
    }
    if (optionDate === this.DateOption.END_OF_DAY) {
      this.setTimeToEndOfDay(date)
    }
  }

}
