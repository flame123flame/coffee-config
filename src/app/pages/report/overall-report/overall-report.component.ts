import { map } from 'rxjs/operators';
import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { ConnectWorld } from '../../../util/connect-world';
import * as moment from 'moment';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseService } from 'src/app/service/BaseService.service';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
const URL = {
  GET_TOTAL_SUMMARY: 'overall-report/get-total-summary',
  GET_REG_DEPOSIT: 'overall-report/get-reg-deposit',
  GET_DEPOSIT_WITHDRAW: 'overall-report/get-deposit-withdraw',
  GET_COMPANY_SURPLUS: 'overall-report/get-company-surplus',
  GET_VALIDBEST_WINLOSS: 'overall-report/get-validbest-winloss',
  GET_COMPANYP_ROFIT_LOSS_TABLE: 'overall-report/get-company-profit-loss',
  GET_GAME_WINLOSS: 'overall-report/get-game-winloss',
  GET_DROPDOWN_PRODUCT: 'game-product-type/get-product-type-list',
}
export class getTotalSummaryRes {
  companytotal: string
  companytotalgr: string
  deposit: string
  depositgr: string
  registercount: number
  registercountgr: string
  summarydate: string;
  totalwinloss: string
  totalwinlossgr: string
  validbet: string
  validbetgr: string
  withdraw: string
  withdrawgr: string
}
@Component({
  selector: 'app-overall-report',
  templateUrl: './overall-report.component.html',
  styleUrls: ['./overall-report.component.scss'],
})
export class OverallReportComponent implements OnInit {
  form: FormGroup;

  selected = '1';
  selected2 = '1';
  tempDate = new Date();
  newDate = this.tempDate.setHours(0, 0, 0)
  startDate = new FormControl(this.tempDate);
  endDate = new FormControl(this.tempDate);
  yearList: number[] = [2020, 2019, 2018, 2017, 2016];
  monthList = new Array('January', 'Fabruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

  years = new Date().getFullYear();
  months = this.monthList[new Date().getMonth()];
  lineChartColorsMon = [
    { backgroundColor: 'rgba(16, 66, 203,0.28)', },
    { backgroundColor: 'rgba(255, 99, 71, 0.5)', },
  ];
  lineChartDataMon = []
  lineChartLabelsMon = [];
  // barChart
  barChartColors = [
    { backgroundColor: 'rgba(16, 66, 203,0.28)', },
    { backgroundColor: 'rgba(255, 99, 71, 0.5)', },
  ];

  barChartData = [
    {
      data: [-5000000, 3000000, 13241324, -3000000, 1345322, 7000000],
      label: 'Win/Loss',
    },
    {
      data: [10000000, 30000000, 24000000, 10000000, 50000000, 48000000],
      label: 'Valid Best',
    },
  ];
  barChartLabels = [
    'Lottery',
    'RNG Game',
    'Animal Sports',
    'MPG',
    'Sportsbook',
  ];

  // PIE
  pieChartColors = [];
  pieChartLabels = [
    'MX Live Games 8M',
    'DG Live Games 5M',
    'CQ9 RNG Games 3M',
    'Others 10M',
  ];
  pieChartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff',
      },
    },
  };
  pieChartData = [20, 30, 40, 70];


  companyColumns: any = [
    { header: '#Reg.', field: 'registerCount', },
    { header: '1st Deposit', field: 'firstDeposit', },
    { header: 'Effective Depositor', field: 'depositPeople', },
    { header: '#Deposit', field: 'depositCount', },
    { header: 'Deposit Amt.', field: 'deposit', type: 'pipeNumber'},
    { header: 'W/D Amt.', field: 'withdraw', type: 'pipeNumber'},
    { header: 'Bal. Adj', field: 'adjustment', type: 'pipeNumber'},
    { header: 'Valid Bets', field: 'validBet', type: 'pipeNumber'},
    { header: 'Win/Loss', field: 'totalWinLoss', type: 'pipeNumber'},
    { header: 'Rebate', field: 'rebate', type: 'pipeNumber'},
    { header: 'Cashback', field: 'cashback', type: 'pipeNumber'},
    { header: 'Promo Bonus', field: 'bonus', type: 'pipeNumber'},
    { header: 'Company Total', field: 'companyTotal', type: 'pipeNumber'},
  ];

  companyTr: any = this.companyColumns.map((data) => { return data.field })
  companyData: any = [];

  sumPlayer = 0
  sumTxn = 0
  sumBet = 0
  sumValidBets = 0
  sumWinLoss = 0

  winLossProductColumns: any = [
    { header: 'Product Type', field: 'productType', footer: 'All Product Types Total' },
    { header: '#Players', field: 'players', type: 'FooterNumber', footer: this.sumPlayer },
    { header: '#Txn', field: 'txn', type: 'FooterNumber', footer: this.sumTxn },
    { header: 'Total Bets', field: 'totalBets', type: 'pipeNumber', footer: this.sumBet },
    // { header: 'Valid Bets', field: 'validBets', type: 'pipeNumber' ,footer:this.sumWinLoss},
    { header: 'Win/Loss', field: 'winLoss', type: 'pipeNumber', footer: this.sumWinLoss }
  ];

  winLossProviderColumns: any = [
    { header: 'Provider', field: 'provider', footer: 'All Provider Total' },
    { header: '#Players', field: 'players', type: 'FooterNumber', footer: this.sumPlayer },
    { header: '#Txn', field: 'txn', type: 'FooterNumber', footer: this.sumTxn },
    { header: 'Total Bets', field: 'totalBets', type: 'pipeNumber', footer: this.sumBet },
    // { header: 'Valid Bets', field: 'validBets',type: 'pipeNumber' ,footer:this.sumWinLoss },
    { header: 'Win/Loss', field: 'winLoss', type: 'pipeNumber', footer: this.sumWinLoss }
  ];

  winLossPDTr: any = this.winLossProductColumns.map((data) => { return data.field })
  winLossPVTr: any = this.winLossProviderColumns.map((data) => { return data.field })

  winLossData: any = [];

  totalSummary: getTotalSummaryRes = new getTotalSummaryRes();

  firstDay
  lastDay
  chartRoundMonth = "Reg./First Deposit count"
  checkChart = '1';
  productList = []
  product = "ALL"
  tomorrow = new Date()
  minDate = new Date()
  checkGameWinLossTable = 'product'
  startDateformat
  endDateformat
  constructor(
    private httpService: BaseService,
    private fb: FormBuilder,
  ) {
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.minDate.setDate(this.minDate.getDate() - 90)
    this.startDateformat = moment(this.startDate.value).format('YYYY-MM-DD');
    this.endDateformat = moment(this.endDate.value).format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.getOverallReportGraphic()
    this.getDropdownProduct()
    this.gameWinLoss()
    this.companyProfitLossTable()
  }

  today() {
  }
  toDate() {
  }

  getDropdownProduct() {
    this.httpService.doGet(URL.GET_DROPDOWN_PRODUCT).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.productList = res.data
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    })
  }

  getOverallReportGraphic() {
    const mm = this.monthList.findIndex(e => e == this.months)
    console.log(this.years + '/' + mm)
    this.firstDay = new Date(this.years, mm, 1);
    this.lastDay = new Date(this.years, mm + 1, 0);
    console.log(this.firstDay, this.lastDay);

    this.httpService.doPost(URL.GET_TOTAL_SUMMARY, { firstDayDate: this.firstDay, lastDayDate: this.lastDay }).subscribe(res => {
      console.log(res);
      if (MessageService.MSG.SUCCESS == res.status) {
        this.totalSummary.companytotal = Number(res.data.companytotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.companytotalgr = Number(res.data.companytotalgr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.deposit = Number(res.data.deposit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.depositgr = Number(res.data.depositgr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.registercount = res.data.registercount
        this.totalSummary.registercountgr = Number(res.data.registercountgr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.summarydate = res.data.summarydate
        this.totalSummary.totalwinloss = Number(res.data.totalwinloss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.totalwinlossgr = Number(res.data.totalwinlossgr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.validbet = Number(res.data.validbet).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.validbetgr = Number(res.data.validbetgr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.withdraw = Number(res.data.withdraw).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.totalSummary.withdrawgr = Number(res.data.withdrawgr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
      else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    })

    if (this.checkChart === '1') {
      this.getRegDeposit(this.firstDay, this.lastDay)
    }
    else if (this.checkChart === '2') {
      this.getDepositWithdrawalAmount(this.firstDay, this.lastDay)
    }
    else if (this.checkChart === '3') {
      this.getCompanySurplus(this.firstDay, this.lastDay)
    }
    this.getValidbestWinloss(this.firstDay, this.lastDay, this.product)
  }

  resetGraphic() {
    this.years = new Date().getFullYear();
    this.months = this.monthList[new Date().getMonth()];
  }

  getRegDeposit(firstDay, lastDay) {
    console.log('Reg./First Deposit count');
    this.checkChart = '1'
    this.chartRoundMonth = 'Reg./First Deposit count'
    this.lineChartDataMon = [{ data: [], label: '#Deposit (depositcount)' }, { data: [], label: '#Reg. (registercount)' }]
    this.httpService.doPost(URL.GET_REG_DEPOSIT, { firstDayDate: firstDay, lastDayDate: lastDay }).subscribe(res => {
      console.log("getRegDepositRes >>>> ", res.data);
      if (MessageService.MSG.SUCCESS == res.status) {
        this.lineChartDataMon[0].data = res.data.map(data => {
          return data.depositcount
        })
        this.lineChartDataMon[1].data = res.data.map(data => {
          return data.registercount
        })
        this.lineChartLabelsMon = res.data.map(data => {
          return data.summarydate
        })
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    })
  }
  getDepositWithdrawalAmount(firstDay, lastDay) {
    console.log('Deposit/Withdrawal Amount');
    this.checkChart = '2'
    this.chartRoundMonth = 'Deposit/Withdrawal Amount'
    this.lineChartDataMon = [{ data: [], label: 'Deposit (deposit)' }, { data: [], label: 'Withdrawal (withdraw)' }]
    this.httpService.doPost(URL.GET_DEPOSIT_WITHDRAW, { firstDayDate: firstDay, lastDayDate: lastDay }).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.lineChartDataMon[0].data = res.data.map(data => {
          return data.deposit
        })
        this.lineChartDataMon[1].data = res.data.map(data => {
          return data.withdraw
        })
        this.lineChartLabelsMon = res.data.map(data => {
          return data.summaryDate
        })
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    })
  }

  getCompanySurplus(firstDay, lastDay) {
    console.log('Company Surplus');
    this.checkChart = '3'
    this.chartRoundMonth = 'Company Surplus'
    this.lineChartDataMon = [{ data: [], label: 'Company Total(companytotal)' }]
    console.log(firstDay, lastDay);
    this.httpService.doPost(URL.GET_COMPANY_SURPLUS, { firstDayDate: firstDay, lastDayDate: lastDay }).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.lineChartDataMon[0].data = res.data.map(data => {
          return data.companyTotal
        })
        this.lineChartLabelsMon = res.data.map(data => {
          return data.summaryDate
        })
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    })
  }

  getValidbestWinloss(firstDay, lastDay, product) {
    console.log(firstDay, lastDay);
    this.httpService.doPost(URL.GET_VALIDBEST_WINLOSS, { firstDayDate: firstDay, lastDayDate: lastDay, productCode: product }).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log(res.data);
      }
    })
  }

  getOverallReportTable() {
    console.log(this.startDate.value);
    console.log(this.endDate.value);
    this.startDateformat = moment(this.startDate.value).format('YYYY-MM-DD');
    this.endDateformat = moment(this.endDate.value).format('YYYY-MM-DD');
    this.gameWinLoss()
    this.companyProfitLossTable()
  }
  resetTable() {
    this.startDate.setValue(this.tempDate)
    this.endDate.setValue(this.tempDate)
  }

  companyProfitLossTable() {
    this.httpService.doPost(URL.GET_COMPANYP_ROFIT_LOSS_TABLE, { firstDayDate: this.startDate.value, lastDayDate: this.endDate.value })
      .subscribe(res => {
        this.companyData = []
        if (MessageService.MSG.SUCCESS == res.status) {
          this.companyData.push(res.data)
        }
      })
  }

  gameWinLoss() {
    this.httpService.doPost(URL.GET_GAME_WINLOSS, { firstDayDate: this.startDate.value, lastDayDate: this.endDate.value, type: this.checkGameWinLossTable })
      .subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          if (this.checkGameWinLossTable === "product") {
            this.sumPlayer = 0
            this.sumTxn = 0
            this.sumBet = 0
            // this.sumValidBets = 0
            this.sumWinLoss = 0
            this.winLossData = res.data.dataList.map(data => {
              this.sumPlayer += data.totalPlayer
              this.sumTxn += data.totalTxn
              this.sumBet += data.totalBet
              // this.sumValidBets += data.totalBet
              this.sumWinLoss += data.totalWinLoss
              return {
                productType: data.productTypeName,
                players: data.totalPlayer,
                txn: data.totalTxn,
                totalBets: data.totalBet,
                winLoss: data.totalWinLoss,
              }
            })
            this.winLossProductColumns[1].footer = this.sumPlayer
            this.winLossProductColumns[2].footer = this.sumTxn
            this.winLossProductColumns[3].footer = this.sumBet
            this.winLossProductColumns[4].footer = this.sumWinLoss
          } else if (this.checkGameWinLossTable === "provider") {
            this.sumPlayer = 0
            this.sumTxn = 0
            this.sumBet = 0
            // this.sumValidBets = 0
            this.sumWinLoss = 0
            this.winLossData = res.data.dataList.map(data => {
              this.sumPlayer += data.totalPlayer
              this.sumTxn += data.totalTxn
              this.sumBet += data.totalBet
              // this.sumValidBets += data.totalBet
              this.sumWinLoss += data.totalWinLoss
              return {
                provider: data.providerName,
                players: data.totalPlayer,
                txn: data.totalTxn,
                totalBets: data.totalBet,
                winLoss: data.totalWinLoss,
              }
            })
            this.winLossProviderColumns[1].footer = this.sumPlayer
            this.winLossProviderColumns[2].footer = this.sumTxn
            this.winLossProviderColumns[3].footer = this.sumBet
            this.winLossProviderColumns[4].footer = this.sumWinLoss
          }
        }
      })
  }
}
