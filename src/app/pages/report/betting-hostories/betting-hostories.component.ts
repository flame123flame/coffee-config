import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  FIND_USERNAME: 'customer/get-user/',
  GET_BETTING_HOSTORIES: 'betting-histories/betting-report',
  GET_DROPDOWN_PROVIDER: 'game-provider/get-provider-list',
  GET_DROPDOWN_PRODUCT: 'game-product-type/get-product-type-list',
  GET_DROPDOWN_GROUP: 'game-group/get-all',
  GET_DROPDOWN_GAME: 'games/get-all-games-no-icon',
  EXPORT_EXCEL_BETTING: 'betting-histories/export-excel-betting',
}
@Component({
  selector: 'app-betting-hostories',
  templateUrl: './betting-hostories.component.html',
  styleUrls: ['./betting-hostories.component.scss'],
})
export class BettingHostoriesComponent implements OnInit {
  sumBets = 0
  sumValidBets = 0
  sumWinLoss = 0
  totalBetAmount = 0
  totalValidBet = 0
  totalWinLoss = 0
  columns = [
    {
      header: 'Bet Time',
      field: 'tg.created_date',
      footer: 'Subtotal',
      fieldSecondFooter: 'bt',
    },
    // {
    //   header: 'Result Time',
    //   field: 'resultTime',
    //   type: 'textCenter'
    // },
    {
      header: 'Ticket ID',
      field: 'tg.game_session_id',
      fieldSecondFooter: 'tid',
    },
    {
      header: 'Provider',
      field: 'provider_name',
      fieldSecondFooter: 'pv',
    },
    {
      header: 'Product Type',
      field: 'product_name',
      fieldSecondFooter: 'pt',
    },
    {
      header: 'Game Group',
      field: 'group_name',
      fieldSecondFooter: 'gg',
    },
    {
      header: 'Game',
      field: 'g.display_name',
      fieldSecondFooter: 'g',
    },
    {
      header: 'Player ID',
      field: 'tg.username',
      fieldSecondFooter: 'pid',
    },
    {
      header: 'Bets',
      field: 'tg.bet',
      type: 'pipeNumber',
      footer: this.sumBets,
      fieldSecondFooter: 'totalBetAmount',
      footerSecondValue: this.totalBetAmount
    },
    {
      header: 'Valid Bets',
      field: 'tg.valid_bet',
      type: 'pipeNumber',
      footer: this.sumValidBets,
      fieldSecondFooter: 'totalValidBet',
      footerSecondValue: this.totalValidBet
    },
    {
      header: 'Win/Loss',
      field: 'tg.win_loss',
      type: 'pipeNumber',
      footer: this.sumWinLoss,
      fieldSecondFooter: 'totalWinLoss',
      footerSecondValue: this.totalWinLoss
    },
  ];

  form: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchField

  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    0,
    0
  )
  lastDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59
  )
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
  dataInput = [];

  tr: any = this.columns.map((data) => {
    return data.field;
  });
  trSecond = [
    'Total',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'totalBetAmount',
    'totalValidBet',
    'totalWinLoss',

  ]
  providerList = []
  productList = []
  groupList = []
  gameList = []
  typeOptions = [
    { code: 'tg.bet', name: 'Bets' },
    { code: 'tg.valid_bet', name: 'Valid Bets' },
    { code: 'tg.win_loss', name: 'Win/Loss' },
  ]
  type = 'ALL'
  constructor(
    @Inject('API_URL') public api_url: string,
    private httpService: BaseService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      startDate: [this.firstDate],
      endDate: [this.lastDate],
      playerId: [null],
      ticketId: [null],
      providerCode: ['ALL'],
      productCode: ['ALL'],
      gameGroupCode: ['ALL'],
      gameCode: ['ALL'],
      from: [null],
      to: [null]
    })
  }

  ngOnInit(): void {
    this.getDropdownProvider()
    this.getDropdownProduct()
    this.getDropdownGroup()
    this.getDropdownGame()
    this.getDatapg()
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

  getDropdownProvider() {
    this.httpService.doGet(URL.GET_DROPDOWN_PROVIDER).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.providerList = res.data
      }
    })
  }
  getDropdownProduct() {
    this.httpService.doGet(URL.GET_DROPDOWN_PRODUCT).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.productList = res.data
      }
    })
  }
  getDropdownGroup() {
    this.httpService.doGet(URL.GET_DROPDOWN_GROUP).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.groupList = res.data
      }
    })
  }
  getDropdownGame() {
    this.httpService.doGet(URL.GET_DROPDOWN_GAME).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.gameList = res.data
      }
    })
  }

  searchValidBet() {
    console.log(this.form.value);
    this.getDatapg()
  }
  clearPlayerId() {
    this.form.controls.playerId.setValue(null)
  }
  clearTicketId() {
    this.form.controls.ticketId.setValue(null)
  }
  resetData() {
    this.form.controls.startDate.setValue(this.firstDate)
    this.form.controls.endDate.setValue(this.lastDate)
    this.form.controls.playerId.setValue(null)
    this.form.controls.ticketId.setValue(null)
    this.form.controls.providerCode.setValue('ALL')
    this.form.controls.productCode.setValue('ALL')
    this.form.controls.gameGroupCode.setValue('ALL')
    this.form.controls.gameCode.setValue('ALL')

    this.dataInput = []
    this.dataLength = 0;
    this.getDatapg()
  }

  getDatapg() {
    let sortCreateDate: PaginateSort = new PaginateSort();
    sortCreateDate.column = 'tg.created_date';
    sortCreateDate.order = 'desc';

    this.dataPG.sort.push(sortCreateDate)
    this.setFilter();
    this.httpService.doPost(URL.GET_BETTING_HOSTORIES, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.dataList.data.map(data => {
          return {
            'tg.created_date': data.betTime ? moment(data.betTime).format('DD/MM/YYYY HH:mm:ss') : '',
            'tg.game_session_id': data.ticketId,
            'provider_name': data.providername,
            'product_name': data.producttypename,
            'group_name': data.groupname,
            'g.display_name': data.gamename,
            'tg.username': data.playerId,
            'tg.bet': data.betAmount,
            'tg.valid_bet': data.validBet,
            'tg.win_loss': data.winLoss,
          }
        })
        this.columns[7].footer = res.data.summary.subtotalBetAmount
        this.columns[8].footer = res.data.summary.subtotalValidBet
        this.columns[9].footer = res.data.summary.subtotalWinLoss
        this.columns[7].footerSecondValue = res.data.summary.totalBetAmount
        this.columns[8].footerSecondValue = res.data.summary.totalValidBet
        this.columns[9].footerSecondValue = res.data.summary.totalWinLoss
        this.dataLength = res.data.dataList.recordsTotal
      }
      this.dataPG.filter = []
      this.dataPG.sort = []
    })
  }
  setFilter() {
    let wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = 'tg.created_date';
    wordFilter.op = 'between'
    wordFilter.value = moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    wordFilter.value1 = moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    this.dataPG.filter.push(wordFilter)
    if (this.form.controls.playerId.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'tg.username';
      wordFilter.op = ' = '
      wordFilter.value = this.form.controls.playerId.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.ticketId.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'tg.game_session_id'
      wordFilter.op = ' = '
      wordFilter.value = this.form.controls.ticketId.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.providerCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'g.provider_code'
      wordFilter.op = ' = '
      wordFilter.value = this.form.controls.providerCode.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.productCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'g.provider_code'
      wordFilter.op = ' = '
      wordFilter.value = this.form.controls.productCode.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.gameGroupCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'g.provider_code'
      wordFilter.op = ' = '
      wordFilter.value = this.form.controls.gameGroupCode.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.gameCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'g.provider_code'
      wordFilter.op = ' = '
      wordFilter.value = this.form.controls.gameCode.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.type != 'ALL') {
      if (this.form.controls.from.value) {
        let data: PaginateFilter = {
          column: this.type,
          op: ">=",
          value: this.form.controls.from.value
        }
        this.dataPG.filter.push(data)
      }
      if (this.form.controls.to.value != 'ALL') {
        let data: PaginateFilter = {
          column: this.type,
          op: "<=",
          value: this.form.controls.to.value
        }
        this.dataPG.filter.push(data)
      }
    }
  }

  pageChange(event: PageChangeModel) {
    this.dataPG.page = event.pageIndex
    this.dataPG.length = event.pageSize
    this.getDatapg();
  }

  sortChange(event: SortChangeModel) {
    this.dataPG.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.dataPG.sort.push(sort)
    }
    this.getDatapg();
  }

  changeYesterday() {
    // this.tempDate.setDate(this.tempDate.getDate() - 1)
    // console.log(this.tempDate);
    // this.form.controls.startDate.setValue(this.tempDate)
    // this.form.controls.endDate.setValue(this.tempDate)
  }

  exportExcel() {
    window.open(this.api_url + `/betting-histories/export-excel-betting`)
  }
}
