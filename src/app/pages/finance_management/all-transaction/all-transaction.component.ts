import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageChangeModel } from 'src/app/models/MatTableChange';
import { PaginateFilter, PaginateRequest } from 'src/app/models/PaginateRequest';


const URL = {
  GET_ALL_GAME: "transaction/get-all-game",
  TRANSACTION_LIST: 'transaction/get-all',
  GET_ALL_TODAY: 'transaction/get-all-to-day',
  GET_SEARCH: 'transaction/all-transaction',
  // GET_SEARCH: 'transaction/search-time',

  GET_PAGINATE_TRANSACTION_GAME: 'game-transaction/get-paginate',
  GET_ALL_PRODUCT_GAME: "game-product-type/get-all-product",
  GET_PROVIDER_GAME_BY_ID: "game-transaction/get-mapping",
  GET_GAME_BY_ID: "game-transaction/get-by-code",
  GET_GAME_BY_PROVIDER: "game-transaction/get-by-provider-code",
}


interface tableAll {
  'tb.id': string;
  'tb.game_code': string;
  'g.display_name': string;
  'tb.bet': string;
  'tb.bet_result': string;
  'tb.game_session_id': string;
  'tb.balance': number;
  'tb.username': number;
  'tb.creared_date': string;
  'tb.game_provider': string;
  'tb.win_loss': string;
  'tb.game_result': string;
  data: any;
}

@Component({
  selector: 'app-all-transaction',
  templateUrl: './all-transaction.component.html',
  styleUrls: ['./all-transaction.component.scss']
})


export class AllTransactionComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private httpService: BaseService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
    this.gameCreateForm()
  }

  searchModel = {
    startDate: null,
    endDate: null,

  }

  transactionGameColumns = [
    { header: 'GameProvider', field: 'tb.game_provider' },
    { header: 'Game Name', field: 'g.display_name' },
    { header: 'Game CODE', field: 'tb.game_code', },
    { header: 'Game Session Id', field: 'tb.game_session_id', },
    { header: 'Bet', field: 'tb.bet', },
    { header: 'Bet Result', field: 'tb.bet_result' },
    { header: 'Win/Loss', field: 'tb.win_loss', type: 'pipeNumber' },
    { header: 'Player Username', field: 'tb.username', },
    { header: 'Created Date', field: 'tb.creared_date', },
  ];

  displayGameTransaction: any = this.transactionGameColumns.map((data) => {
    return data.field;
  });
  gameProviderList = [];
  productTypeList = [];
  gameList = [];
  gameLength = 0
  gameTransactionData = []
  formGameTransactionFilter: FormGroup;
  paginateGameReq: PaginateRequest = new PaginateRequest();

  datainput = [];

  getAllGame() {
    this.httpService.doGet(URL.GET_ALL_GAME).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.datainput = res.data
        console.log(this.datainput)
        this.datainput.forEach(list => {
          list.createdDate = moment(list.createdDate).format('DD/MM/YYYY HH:mm:ss');
          list.bet = list.bet != null ? Number(list.bet).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ' ';
          list.betResult = list.betResult != null ? Number(list.betResult).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ' ';
          list.balance = list.balance != null ? Number(list.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ' ';
        });
      } else {
      }
    })
  }

  getGamePaginate() {
    this.getAllGameList()
    this.gameTransactionData = [];
    let wordFilter: PaginateFilter = new PaginateFilter();
    this.paginateGameReq.filter = [];
    if (this.formGameTransactionFilter.controls.radio.value != "ALL" && this.formGameTransactionFilter.controls.radio.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.created_date';
      wordFilter.op = 'between';
      wordFilter.value = moment(this.formGameTransactionFilter.controls.dateStart.value).format('YYYY/MM/DD HH:mm:ss');
      wordFilter.value1 = moment(this.formGameTransactionFilter.controls.dateEnd.value).format('YYYY/MM/DD HH:mm:ss');
      this.paginateGameReq.filter.push(wordFilter);
    }
    console.log(this.paginateGameReq.filter)
    if (this.formGameTransactionFilter.controls.gameCode.value != "ALL" && this.formGameTransactionFilter.controls.gameCode.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.game_code';
      wordFilter.op = 'contain';
      wordFilter.value = this.formGameTransactionFilter.controls.gameCode.value;
      this.paginateGameReq.filter.push(wordFilter);
    }

    if (this.formGameTransactionFilter.controls.gameProviderCode.value != "ALL" && this.formGameTransactionFilter.controls.gameProviderCode.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.game_provider';
      wordFilter.op = 'contain';
      wordFilter.value = this.formGameTransactionFilter.controls.gameProviderCode.value;
      this.paginateGameReq.filter.push(wordFilter);
    }

    this.httpService.doPost(URL.GET_PAGINATE_TRANSACTION_GAME, this.paginateGameReq).subscribe(res => {

      if (res.status === 'SUCCESS') {
        const arr: tableAll[] = [];

        res.data.data.forEach(element => {
          arr.push({
            'tb.id': element.id,
            'tb.game_code': element.gameCode,
            'tb.bet': element.bet,
            'g.display_name': element.displayName,
            'tb.bet_result': element.betResult,
            'tb.game_session_id': element.gameSessionId,
            'tb.balance': element.balance,
            'tb.username': element.username,
            'tb.creared_date': moment(element.createdDate).format('DD/MM/YYYY HH:mm:ss'),
            'tb.game_provider': element.gameProvider,
            'tb.win_loss': element.winLoss,
            'tb.game_result': element.gameResult,
            data: element
          });
        });
        this.gameTransactionData = arr;
        console.log(this.gameTransactionData);
        this.gameLength = res.data.recordsTotal;
      }
    })
  }

  getAllGameList() {
    this.httpService.doGet(URL.GET_ALL_PRODUCT_GAME).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.productTypeList = res.data
      }
    })
    this.httpService.doGet(`${URL.GET_PROVIDER_GAME_BY_ID}/ALL`).subscribe(res => {
      if (res.status = "SUCCESS") {
        this.gameProviderList = res.data
      }
    })
    this.httpService.doGet(`${URL.GET_GAME_BY_PROVIDER}/${'ALL'}`).subscribe(res => {
      if (res.status = "SUCCESS") {
        this.gameList = res.data
      }
    })
  }


  gameSearchPaginate() {
    this.getGamePaginate();
  }

  gameCreateForm() {
    let today = new Date()
    this.formGameTransactionFilter = this.formBuilder.group({
      // username: '',
      // transferAmount: '',
      gameCode: 'ALL',
      gameGroupCode: 'ALL',
      gameProviderCode: 'ALL',
      gameProductType: 'ALL',
      radio: 'ALL',
      dateStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
      dateEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
      // transferId: '',
      // installmentSearch: [null],
      // transactionGroupSearch: [null]
    });
  }

  gameResetSearch() {
    this.paginateGameReq.filter = [];
    this.gameCreateForm()
    this.getGamePaginate()
  }

  gameRadioChange(event) {
    let today = new Date()
    console.log(this.formGameTransactionFilter.controls.gameProductType.value)
    console.log(event)
    if (event.value == 1) {
      this.formGameTransactionFilter.controls.dateStart.setValue(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
      this.formGameTransactionFilter.controls.dateEnd.setValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0))
    }
    else if (event.value == 2) {
      this.formGameTransactionFilter.controls.dateStart.setValue(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 0, 0, 0))
      this.formGameTransactionFilter.controls.dateEnd.setValue(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
    }
  }

  onGameProductChange(event) {
    this.httpService.doGet(`${URL.GET_PROVIDER_GAME_BY_ID}/${event.value}`).subscribe(res => {
      if (res.status = "SUCCESS") {
        this.gameProviderList = res.data
      }
    })
  }

  onGameProviderChange(event) {
    this.httpService.doGet(`${URL.GET_GAME_BY_PROVIDER}/${event.value}`).subscribe(res => {
      if (res.status = "SUCCESS") {
        console.log(res)
        this.gameList = res.data
      }
    })
  }

  //-------------------------- KEEP USE LATER DONE DELETE ------------------------- BY FORD //
  // onGameGroupChange(event) {
  //   this.httpBase.doGet(`${URL.GET_GAME_BY_ID}/?code=${this.formFilter.controls.gameProviderCode.value}&groupCode=${event.value}`).subscribe(res => {
  //     if (res.status = "SUCCESS") {
  //       console.log(res)
  //       this.gameList = res.data
  //     }
  //   })
  // }

  gamePageAllChange(event: PageChangeModel) {
    this.paginateGameReq.page = event.pageIndex;
    this.paginateGameReq.length = event.pageSize;
    this.getGamePaginate();
  }



  columns: any = [
    {
      header: 'Income',
      field: 'income',
    },
    {
      header: 'Income Amount (Count/People)',
      field: 'incomAmount',
      // type: 'textNumber',
    },
    {
      header: 'Outlay',
      field: 'outlay',
    },
    {
      header: 'Outlay Amount (Count/People)',
      field: 'outlayAmount',
      // type: 'textNumber'
    },
  ];

  tr: any = [
    'income',
    'incomAmount',
    'outlay',
    'outlayAmount',
  ];
  model = {
    deposit: '',
    manual: '',

    balance: '',
    bonus: '',
    withdraw: '',
    af: '',
    sub: '',
    rebate: '',
    cashback: ''
  }
  data: any = [
    { income: 'Company Deposit', incomAmount: '', outlay: 'Promotion Balance', outlayAmount: '' },
    { income: 'Manual Add', incomAmount: '', outlay: 'Promotion Bonus', outlayAmount: '' },
    { income: '', incomAmount: '', outlay: 'Withdraw', outlayAmount: '' },
    { income: '', incomAmount: '', outlay: 'Withdraw Af', outlayAmount: '' },
    { income: '', incomAmount: '', outlay: 'Manual Sub', outlayAmount: '' },
    { income: '', incomAmount: '', outlay: 'Rebate', outlayAmount: '' },
    { income: '', incomAmount: '', outlay: 'Cashback', outlayAmount: '' },
    { income: '+', incomAmount: '', outlay: '-', outlayAmount: '' },
    { income: 'Total', incomAmount: '', outlay: 'Total Balance', outlayAmount: '' },

  ];

  startDate = '';
  endDate = '';
  selected1 = '2'
  selected2 = '2'

  columnsUncertain: any = [
    { header: 'Create On', field: 'createOn', type: 'textCenter' },
    {
      header: 'Player', field: 'player', type: 'link',
      onClick: (data) => { }
    },
    { header: 'Transfer Amount', field: 'transferAmount', type: 'textNumber' },
    { header: 'From', field: 'from' },
    { header: 'To', field: 'to' },
    { header: 'Remark', field: 'remark' },
    { header: 'Status', field: 'status', type: 'textCenter' },
    { header: 'Update By', field: 'updBy', type: 'textCenter' }
  ];

  trUncertain: any = [
    'createOn',
    'player',
    'transferAmount',
    'from',
    'to',
    'remark',
    'status',
    'updBy',
    'action',
  ];
  dataUncertain: any = [
    {
      createOn: moment('2020-12-12').format('DD/MM/YYYY'),
      player: 'opzaza',
      transferAmount: '1.33',
      from: 'MAIN',
      to: 'AE_LOT',
      remark: 'Auto Transfer',
      status: 'uncertain',
      updBy: '',
      action: '',
    },
    {
      createOn: moment('2020-12-12').format('DD/MM/YYYY'),
      player: 'opzaza',
      transferAmount: '1.33',
      from: 'MAIN',
      to: 'AE_LOT',
      remark: 'Auto Transfer',
      status: 'uncertain',
      updBy: '',
      action: '',
    }
  ];


  columnsTransactionList: any = [
    { header: 'Transaction Date', field: 'transactionDate', type: 'textCenter' },
    { header: 'Player', field: 'username' },
    { header: 'Transaction Type', field: 'transactionType' },
    { header: '+', field: 'addBalance', type: 'pipeNumber' },
    { header: '-', field: 'subBalance', type: 'pipeNumber' },
    { header: 'From', field: 'fromSender' },
    { header: 'Transfer', field: 'tranferAmount' },
    { header: 'To', field: 'toRecive' },
  ];

  columnsTransactionGame: any = [
    { header: 'Transaction Date', field: 'createdDate', type: 'textCenter' },
    {
      header: 'Player', field: 'username', type: 'link',
      onClick: (data) => { }
    },
    { header: 'Game Code', field: 'gameCode' },
    { header: 'Bet', field: 'bet', type: 'textNumber' },
    { header: 'Bet Result', field: 'betResult', type: 'textNumber' },
    { header: 'Balance', field: 'balance', type: 'textNumber' },
  ];


  trTransactionGame: any = [
    'createdDate',
    'gameCode',
    'username',
    'bet',
    'betResult',
    'balance',
    'action',
  ];

  dataTransactionGame: any = [
    {
      transactionDate: '',
      gamecode: '',
      player: '',
      plus: '',
      minus: '',
      balance: '',
      action: '',
    },]

  trTransactionList: any = [
    'transactionDate',
    'username',
    'transactionType',
    'addBalance',
    'subBalance',
    'fromSender',
    'tranferAmount',
    'toRecive',
    // 'action',
  ];

  dataTransactionList: any = [];

  checkboxAdd = false;
  checkboxSubtract = false;
  checkboxTransfer = false;

  ngOnInit(): void {
    this.today()
    this.getAllGame()
    this.loadTransactionList()
    this.getGamePaginate()
    this.searchTime()
  }
  searchTime() {
    this.searchModel
    console.log(this.searchModel)
    this.httpService.doPost(URL.GET_SEARCH, this.searchModel).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {

        this.data[0].incomAmount = res.data.companyDeposit
        this.data[0].incomAmount = Number(this.data[0].incomAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[0].incomAmount = this.data[0].incomAmount + '(' + res.data.countDeposit + '/' + res.data.peopleDeposit + ')'

        this.data[1].incomAmount = res.data.manualAdd
        this.data[1].incomAmount = Number(this.data[1].incomAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[1].incomAmount = this.data[1].incomAmount + '(' + res.data.countManualAdd + '/' + res.data.peopleManualAdd + ')'

        this.data[7].incomAmount = res.data.companyDeposit + res.data.manualAdd
        var incom = this.data[7].incomAmount
        this.data[7].incomAmount = Number(this.data[7].incomAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })


        this.data[0].outlayAmount = res.data.promotionBalance
        this.data[0].outlayAmount = Number(this.data[0].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[0].outlayAmount = this.data[0].outlayAmount + '(' + res.data.countPromotionBalance + '/' + res.data.peoplePromotionBalance + ')'

        this.data[1].outlayAmount = res.data.promotionBonus
        this.data[1].outlayAmount = Number(this.data[1].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[1].outlayAmount = this.data[1].outlayAmount + '(' + res.data.countPromotionBonus + '/' + res.data.peoplePromotionBonus + ')'

        this.data[2].outlayAmount = res.data.withdraw
        this.data[2].outlayAmount = Number(this.data[2].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[2].outlayAmount = this.data[2].outlayAmount + '(' + res.data.countWithdraw + '/' + res.data.peopleWithdraw + ')'

        this.data[3].outlayAmount = res.data.withdrawAf
        this.data[3].outlayAmount = Number(this.data[3].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[3].outlayAmount = this.data[3].outlayAmount + '(' + res.data.countWithdrawAf + '/' + res.data.peopleWithdrawAf + ')'

        this.data[4].outlayAmount = res.data.manualSub
        this.data[4].outlayAmount = Number(this.data[4].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[4].outlayAmount = this.data[4].outlayAmount + '(' + res.data.countManualSub + '/' + res.data.peopleManualSub + ')'

        this.data[5].outlayAmount = res.data.rebate
        this.data[5].outlayAmount = Number(this.data[5].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[5].outlayAmount = this.data[5].outlayAmount + '(' + res.data.countRebate + '/' + res.data.peopleRebate + ')'

        this.data[6].outlayAmount = res.data.cashback
        this.data[6].outlayAmount = Number(this.data[6].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[6].outlayAmount = this.data[6].outlayAmount + '(' + res.data.countCashback + '/' + res.data.peopleCashback + ')'
        this.data[7].outlayAmount = res.data.promotionBalance + res.data.promotionBonus + res.data.withdraw + res.data.withdrawAf
          + res.data.manualSub + res.data.rebate
        var outlay = this.data[7].outlayAmount

        this.data[7].outlayAmount = Number(this.data[7].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

        this.data[8].incomAmount = incom - outlay
        this.data[8].incomAmount = Number(this.data[8].incomAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        this.data[8].outlayAmount = res.data.total
        this.data[8].outlayAmount = Number(this.data[8].outlayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
    })


  }
  reset() {
    this.searchModel.startDate = ''
    this.searchModel.endDate = ''
  }

  today() {
    this.searchModel.startDate = moment().format("yyyy-MM-DDT00:00:00");
    // this.searchModel.startDate = this.searchModel.startDate.toISOString();
    this.searchModel.endDate = moment().format("yyyy-MM-DDT23:59:59");
    // this.searchModel.endDate = this.searchModel.endDate + ' 23:59:59'
  }

  yesterday() {
    this.searchModel.startDate = moment().add(-1, 'day').format("yyyy-MM-DDT00:00:00");
    // this.searchModel.startDate = this.startDate + ' 00:00:00'
    this.searchModel.endDate = moment().add(-1, 'day').format("yyyy-MM-DDT23:59:59");
    // this.searchModel.endDate = this.endDate + ' 23:59:59'
  }

  thisWeek() {
    this.searchModel.startDate = moment().day(1).format("yyyy-MM-DDT00:00:00");
    // this.startDate = this.startDate + ' 00:00:00'
    this.searchModel.endDate = moment().day(7).format("yyyy-MM-DDT23:59:59");
    // this.endDate = this.endDate + ' 23:59:59'
  }

  lastWeek() {
    this.searchModel.startDate = moment().day(-6).format("yyyy-MM-DDT00:00:00");
    // this.startDate = this.startDate + ' 00:00:00'
    this.searchModel.endDate = moment().day(0).format("yyyy-MM-DDT23:59:59");
    // this.endDate = this.endDate + ' 23:59:59'
  }

  thisMonth() {
    this.searchModel.startDate = moment().startOf('month').format("yyyy-MM-DDT00:00:00");
    // this.startDate = this.startDate + ' 00:00:00'
    this.searchModel.endDate = moment().endOf('month').format("yyyy-MM-DDT23:59:59");
    // this.endDate = this.endDate + ' 23:59:59'
  }

  lastMonth() {
    this.searchModel.startDate = moment().subtract(1, 'months').startOf('month').format("yyyy-MM-DDT00:00:00");
    // this.startDate = this.startDate + ' 00:00:00'
    this.searchModel.endDate = moment().subtract(1, 'months').endOf('month').format("yyyy-MM-DDT23:59:59");
    // this.endDate = this.endDate + ' 23:59:59'
  }

  past7Day() {
    this.searchModel.startDate = moment().add(-6, 'day').format("yyyy-MM-DDT00:00:00");
    // this.startDate = this.startDate + ' 00:00:00'
    this.searchModel.endDate = moment().add(0, 'day').format("yyyy-MM-DDT23:59:59");
    // this.endDate = this.endDate + ' 23:59:59'
  }

  past30Day() {
    this.searchModel.startDate = moment().add(-29, 'day').format("yyyy-MM-DDT00:00:00");
    // this.startDate = this.startDate + ' 00:00:00'
    this.searchModel.endDate = moment().add(0, 'day').format("yyyy-MM-DDT23:59:59");
    // this.endDate = this.endDate + ' 23:59:59'
  }

  loadTransactionList() {
    this.httpService.doGet(URL.TRANSACTION_LIST).subscribe(data => {
      if (data.status == "SUCCESS") {
        this.dataTransactionList = data.data
        this.dataTransactionList.forEach(list => {
          list.createdDate = moment(list.createdDate).format('DD/MM/YYYY HH:mm:ss');
          list.transactionDate = moment(list.transactionDate).format('DD/MM/YYYY HH:mm:ss');
          list.addBalance = list.addBalance;
        });
        console.log(this.dataTransactionList);
      }
    })
  }
}
