import { start } from 'repl';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { FilterOp, PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { MatDatePickerService } from 'src/app/service/MatDatePickerService.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  FIND_USERNAME: 'customer/get-user/',
  SEARCH_PALYER_REPORT: 'player-report/player-paginate',
}
@Component({
  selector: 'app-player-report',
  templateUrl: './player-report.component.html',
  styleUrls: ['./player-report.component.scss'],
})
export class PlayerReportComponent implements OnInit {
  form: FormGroup;
  sumDepositAmt = 0
  sumWithdrawAmt = 0
  sumTotalBets = 0
  sumValidBets = 0
  sumWinLoss = 0
  sumRebate = 0
  sumCashback = 0
  sumDepositCount = 0
  sumWithdrawCount = 0

  totaldepositCount = 0
  totaldepositAmt = 0
  totalwithdrawCount = 0
  totalWithdrawAmt = 0
  totalBets = 0
  totalValidBets = 0
  totalWinLoss = 0
  totalRebate = 0
  totalCashback = 0
  columns = [
    {
      header: 'Player ID',
      field: 'playerID',
      footer: 'Subtotal',
      fieldSecondFooter: 'pyid',
    },
    {
      header: 'Real Name',
      field: 'realName',
      fieldSecondFooter: 'rn',
    },
    {
      header: 'Group Level',
      field: 'groupLevel',
      fieldSecondFooter: 'glv',
    },
    {
      header: 'Deposit count',
      field: 'depositCount',
      type: 'FooterNumber',
      footer: this.sumDepositCount,
      fieldSecondFooter: 'totaldepositCount',
      footerSecondValue: this.totaldepositCount
    },
    {
      header: 'Deposit Amt.',
      field: 'depositAmt',
      type: 'pipeNumber',
      footer: this.sumDepositAmt,
      fieldSecondFooter: 'totaldepositAmt',
      footerSecondValue: this.totaldepositAmt
    },
    {
      header: 'Withdraw count',
      field: 'withdrawCount',
      type: 'FooterNumber',
      footer: this.sumWithdrawCount,
      fieldSecondFooter: 'totalwithdrawCount',
      footerSecondValue: this.totalwithdrawCount
    },
    {
      header: 'Withdraw Amt.',
      field: 'withdrawAmt',
      type: 'pipeNumber',
      footer: this.sumWithdrawAmt,
      fieldSecondFooter: 'totalWithdrawAmt',
      footerSecondValue: this.totalWithdrawAmt
    },
    {
      header: 'Total Bets',
      field: 'totalBets',
      type: 'pipeNumber',
      footer: this.sumTotalBets,
      fieldSecondFooter: 'totalBetsFooter',
      footerSecondValue: this.totalBets
    },
    {
      header: 'Valid Bets',
      field: 'validBets',
      type: 'pipeNumber',
      footer: this.sumValidBets,
      fieldSecondFooter: 'totalValidBets',
      footerSecondValue: this.totalValidBets
    },
    {
      header: 'Win/Loss',
      field: 'winLoss',
      type: 'pipeNumber',
      footer: this.sumWinLoss,
      fieldSecondFooter: 'totalWinLoss',
      footerSecondValue: this.totalWinLoss
    },
    {
      header: 'Rebate',
      field: 'rebate',
      type: 'pipeNumber',
      footer: this.sumRebate,
      fieldSecondFooter: 'totalRebate',
      footerSecondValue: this.totalRebate
    },
    {
      header: 'Cashback',
      field: 'cashback',
      type: 'pipeNumber',
      footer: this.sumCashback,
      fieldSecondFooter: 'totalCashback',
      footerSecondValue: this.totalCashback
    },
  ];

  dataInput = [];

  tr: any = this.columns.map((data) => {
    return data.field;
  });

  trSecond = [
    'Total',
    'emptyFooter',
    'emptyFooter',
    'totaldepositCount',
    'totaldepositAmt',
    'totalwithdrawCount',
    'totalWithdrawAmt',
    'totalBetsFooter',
    'totalValidBets',
    'totalWinLoss',
    'totalRebate',
    'totalCashback',

  ]

  // keywordList: String[] = ['Player ID', 'Agent(old)', 'Agent(team)', 'Real Name'];
  // timeZoneList: String[] = ['GMT+0800 (System time Zone)', 'GMT+0700', 'GMT+0630'];
  // tagNameList: String[] = ['HightRiskMember', 'SameIP', 'ลงะเบียนบัตรประชาชนแล้ว', 'สลิปมั่ว'];
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 6,
    0, 0);
  lastDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59
  );
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchField
  today = new Date()
  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 90,
    0,
    0,
    0
  )
  maxDate = new Date(new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59)
  dataLength: number = 0;
  dataPG: PaginateRequest = new PaginateRequest();

  balanceTypeOptions: string[] = ['Deposit', 'Withdrawal Amount', 'Valid Bets', 'Total Win/Loss'];
  balanceType = 'ALL'
  constructor(
    @Inject('API_URL') public api_url: string,
    private httpService: BaseService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      startDate: [this.firstDate],
      endDate: [this.lastDate],
      playerId: [null],
      from: [null],
      to: [null],
    })
  }

  ngOnInit(): void {
    this.searchValidBet()
  }

  onKeyup(event: any) {
    if (event.length >= 3)
      this.findUsername(event)
    else if (event.length < 3)
      this.options = []
  }
  onSelectionChanged(event: any) {
    this.findUsername(event)
    this.searchField = event
  }
  findUsername(username) {
    this.httpService.doGet(URL.FIND_USERNAME + username).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.options = res.data;
        this.filteredOptions = this.form.valueChanges
          .pipe(startWith(''), map(value => this._filter(value)));
      }
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.options.filter(option => option.includes(filterValue))
  }
  clearPlayerId() {
    this.form.controls.playerId.setValue(null)
    this.searchValidBet()
  }
  resetData() {
    this.form.controls.startDate.setValue(this.firstDate)
    this.form.controls.endDate.setValue(this.lastDate)
    this.form.controls.playerId.setValue(null)
    this.form.controls.from.setValue(null)
    this.form.controls.to.setValue(null)
    this.balanceType = 'ALL'
    this.dataInput = []
    this.searchValidBet()
  }

  searchValidBet() {
    let wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = '';
    wordFilter.op = ''
    wordFilter.value = moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    wordFilter.value1 = moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()

    console.log(wordFilter.value1);

    this.dataPG.filter.push(wordFilter)
    if (this.form.controls.playerId.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'c.username';
      wordFilter.op = FilterOp.EQUAL
      wordFilter.value = this.form.controls.playerId.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.balanceType === 'Deposit') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'tldt.deposiAmt';
      wordFilter.op = FilterOp.BETWEEN
      wordFilter.value = this.form.controls.from.value
      wordFilter.value1 = this.form.controls.to.value
      this.dataPG.filter.push(wordFilter)
    } else if (this.balanceType === 'Withdrawal Amount') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'tlwd.withdrawAmt';
      wordFilter.op = FilterOp.BETWEEN
      wordFilter.value = this.form.controls.from.value
      wordFilter.value1 = this.form.controls.to.value
      this.dataPG.filter.push(wordFilter)
    }
    else if (this.balanceType === 'Valid Bets') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'tg.validBets';
      wordFilter.op = FilterOp.BETWEEN
      wordFilter.value = this.form.controls.from.value
      wordFilter.value1 = this.form.controls.to.value
      this.dataPG.filter.push(wordFilter)
    }
    else if (this.balanceType === 'Total Win/Loss') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'tg.winLoss';
      wordFilter.op = FilterOp.BETWEEN
      wordFilter.value = this.form.controls.from.value
      wordFilter.value1 = this.form.controls.to.value
      this.dataPG.filter.push(wordFilter)
    }

    this.httpService.doPost(URL.SEARCH_PALYER_REPORT, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.sumDepositAmt = 0
        // this.sumWithdrawAmt = 0
        // this.sumValidBets = 0
        // this.sumWinLoss = 0
        // this.sumRebate = 0
        // this.sumCashback = 0
        // this.sumDepositCount = 0
        // this.sumWithdrawCount = 0
        // this.totaldepositCount = 0
        // this.totaldepositAmt = 0
        // this.totalwithdrawCount = 0
        // this.totalWithdrawAmt = 0
        // this.totalBets = 0
        // this.totalValidBets = 0
        // this.totalWinLoss = 0
        // this.totalRebate = 0
        // this.totalCashback = 0
        this.dataInput = res.data.dataList.data.map(data => {
          return {
            playerID: data.username,
            realName: data.realName,
            groupLevel: data.groupName,
            depositCount: data.depositCount,
            depositAmt: data.depositAmt,
            withdrawCount: data.withdrawCount,
            withdrawAmt: data.withdrawAmt,
            totalBets: data.totalBets,
            validBets: data.validBets,
            winLoss: data.winLoss,
            rebate: data.rebate,
            cashback: data.cashback,
          }
        })
        this.columns[3].footer = res.data.summary.subTotalDepositCount
        this.columns[4].footer = res.data.summary.subTotalDepositAmt
        this.columns[5].footer = res.data.summary.subTotalWithdrawCount
        this.columns[6].footer = res.data.summary.subTotalWithdrawAmt
        this.columns[7].footer = res.data.summary.subTotalBets
        this.columns[8].footer = res.data.summary.subTotalValidBets
        this.columns[9].footer = res.data.summary.subTotalWinLoss
        this.columns[10].footer = res.data.summary.subTotalRebate
        this.columns[11].footer = res.data.summary.subTotalCashback
        this.columns[3].footerSecondValue = res.data.summary.totalDepositCount
        this.columns[4].footerSecondValue = res.data.summary.totalDepositAmt
        this.columns[5].footerSecondValue = res.data.summary.totalWithdrawCount
        this.columns[6].footerSecondValue = res.data.summary.totalWithdrawAmt
        this.columns[7].footerSecondValue = res.data.summary.totalBets
        this.columns[8].footerSecondValue = res.data.summary.totalValidBets
        this.columns[9].footerSecondValue = res.data.summary.totalWinLoss
        this.columns[10].footerSecondValue = res.data.summary.totalRebate
        this.columns[11].footerSecondValue = res.data.summary.totalCashback

        this.dataLength = res.data.dataList.recordsTotal
      }
      this.dataPG.filter = []
    })
  }
  pageChange(event: PageChangeModel) {
    this.dataPG.page = event.pageIndex
    this.dataPG.length = event.pageSize
    this.searchValidBet();
  }

  sortChange(event: SortChangeModel) {
    this.dataPG.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.dataPG.sort.push(sort)
    }
    this.searchValidBet();
  }
  exportExcel() { }
}
