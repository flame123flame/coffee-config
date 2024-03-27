import { MessageService } from './../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MatDatePickerService } from 'src/app/service/MatDatePickerService.service';
const URL = {
  GET_PROFIT_LOSS_REPORT: 'profit-loss-report/get-profit-loss',
  GET_PROFIT_LOSS_REPORT_MONTHLY: 'profit-loss-report/get-profit-loss-monthly',
};
@Component({
  selector: 'app-profit-or-loss-report',
  templateUrl: './profit-or-loss-report.component.html',
  styleUrls: ['./profit-or-loss-report.component.scss'],
})
export class ProfitOrLossReportComponent implements OnInit {
  sumRegistercount = 0;
  sumFirstdepositcount = 0;
  sumDepositcount = 0;
  sumDeposit = 0;
  sumWithdrawcount = 0;
  sumWithdraw = 0;
  sumValidbet = 0;
  sumCompanywinloss = 0;
  sumBonus = 0;
  sumRebate = 0;
  sumCashback = 0;
  columns = [
    {
      header: 'Date',
      field: 'summarydate',
      type: 'textCenter',
      footer: 'Total',
    },
    {
      header: '#Reg.',
      field: 'registercount',
      type: 'textNumber',
      footer: this.sumRegistercount,
    },
    {
      header: '1st Deposit',
      field: 'firstdepositcount',
      type: 'textNumber',
      footer: this.sumFirstdepositcount,
    },
    {
      header: '#Deposit',
      field: 'depositcount',
      type: 'textNumber',
      footer: this.sumDepositcount,
    },
    {
      header: 'Company Deposit',
      field: 'deposit',
      type: 'pipeNumber',
      footer: this.sumDeposit,
    },
    // {
    //   header: '3rd Party Deposit',
    //   field: 'threerdParty',
    //   type: 'textNumber'
    // },
    {
      header: '#W/D',
      field: 'withdrawcount',
      type: 'textNumber',
      footer: this.sumWithdrawcount,
    },
    {
      header: 'Withdrawal',
      field: 'withdraw',
      type: 'pipeNumber',
      footer: this.sumWithdraw,
    },
    {
      header: 'Valid Bets',
      field: 'validbet',
      type: 'pipeNumber',
      footer: this.sumValidbet,
    },
    {
      header: 'Company W/L',
      field: 'companywinloss',
      type: 'pipeNumber',
      footer: this.sumCompanywinloss,
    },
    {
      header: 'Compamy Bonus',
      field: 'bonus',
      type: 'pipeNumber',
      footer: this.sumBonus,
    },
    {
      header: 'Rebate',
      field: 'rebate',
      type: 'pipeNumber',
      footer: this.sumRebate,
    },
    {
      header: 'Cashback',
      field: 'cashback',
      type: 'pipeNumber',
      footer: this.sumCashback,
    },
  ];

  dataInput = [];

  tr: any = this.columns.map((data) => {
    return data.field;
  });
  checkType = 'Daily'
  checkSendApi = 'Daily'
  tempDate = new Date();
  newDate = this.tempDate.setHours(0, 0, 0);
  tempDateWeek = new Date();
  tempDateWeekNewDay = this.tempDateWeek.setHours(0, 0, 0);
  tempDateWeekNewDayd = this.tempDateWeek.setDate(
    this.tempDateWeek.getDate() - 6
  );
  startDate = new FormControl(this.tempDateWeek);
  endDate = new FormControl(this.tempDate);
  tomorrow = new Date();
  form: FormGroup;
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    0)
  lastDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59)
  firstDateM = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
    0,
    0)
  lastDateM = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59)
  constructor(
    private httpService: BaseService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      startDate: [this.firstDate],
      endDate: [this.lastDate],
      startDateM: [this.firstDateM],
      endDateM: [this.lastDateM],
    })
  }

  ngOnInit(): void {
    this.getProfitLossReport();
  }

  resetSearch() { }
  searchReportTable() {
    this.getProfitLossReport();
  }

  getProfitLossReport() {
    let wordFilter = {
      value: '',
      value1: '',
    }

    if (this.checkType == 'Daily') {
      wordFilter.value = moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
      wordFilter.value1 = moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    }
    else {
      wordFilter.value = moment(this.form.controls.startDateM.value).format('YYYY/MM/DD HH:mm:ss').toString()
      wordFilter.value1 = moment(this.form.controls.endDateM.value).format('YYYY/MM/DD HH:mm:ss').toString()
    }

    this.checkSendApi =this.checkType

    if (this.checkType == 'Daily') {
      this.httpService
        .doPost(URL.GET_PROFIT_LOSS_REPORT, {
          firstDayDate: wordFilter.value,
          lastDayDate: wordFilter.value1,
        })
        .subscribe((res) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.dataInput = res.data.dataList;
            this.columns[1].footer = res.data.summary.registercount;
            this.columns[2].footer = res.data.summary.firstdepositcount;
            this.columns[3].footer = res.data.summary.depositcount;
            this.columns[4].footer = res.data.summary.deposit;
            this.columns[5].footer = res.data.summary.withdrawcount;
            this.columns[6].footer = res.data.summary.withdraw;
            this.columns[7].footer = res.data.summary.validbet;
            this.columns[8].footer = res.data.summary.companywinloss;
            this.columns[9].footer = res.data.summary.bonus;
            this.columns[10].footer = res.data.summary.rebate;
            this.columns[11].footer = res.data.summary.cashback;
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        });
    } else {
      console.log("Monthly");
      this.httpService
        .doPost(URL.GET_PROFIT_LOSS_REPORT_MONTHLY, {
          firstDayDate: wordFilter.value,
          lastDayDate: wordFilter.value1,
        })
        .subscribe((res) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.dataInput = res.data.dataList;
            this.columns[1].footer = res.data.summary.registercount;
            this.columns[2].footer = res.data.summary.firstdepositcount;
            this.columns[3].footer = res.data.summary.depositcount;
            this.columns[4].footer = res.data.summary.deposit;
            this.columns[5].footer = res.data.summary.withdrawcount;
            this.columns[6].footer = res.data.summary.withdraw;
            this.columns[7].footer = res.data.summary.validbet;
            this.columns[8].footer = res.data.summary.companywinloss;
            this.columns[9].footer = res.data.summary.bonus;
            this.columns[10].footer = res.data.summary.rebate;
            this.columns[11].footer = res.data.summary.cashback;
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        });
    }
  }

  changeType(event) {
    this.checkType = event
  }

  filterDefaultStart = (d: Date | null): boolean => {
    const day = (d || new Date()).getDate();
    return day === day;
  }
  filterDefaultEnd = (d: Date | null): boolean => {
    const day = (d || new Date()).getDate();
    return day === day;
  }

  filterFirstDayOfTheMonth = (d: Date | null): boolean => {
    const day = (d || new Date()).getDate();
    // Select only the first day of the month.
    return day === 1;
  }
  filterLastDayOfTheMonth = (d: Date | null): boolean => {
    const day = (d || new Date()).getDate();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    // Select only the last day of the month.
    return day === lastDay.getDate();
  }
}