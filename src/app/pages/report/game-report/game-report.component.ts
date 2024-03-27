import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';

const URL = {
  GET_REPORT_DAILY: 'game-report/get-report-daily',
  GET_REPORT_MONTHLY: 'game-report/get-report-monthly',
  GET_REPORT_GAME: 'game-report/get-report-game',
  GET_DROPDOWN_PROVIDER: 'game-provider/get-provider-list',
  GET_DROPDOWN_PRODUCT: 'game-product-type/get-product-type-list',
  GET_DROPDOWN_GROUP: 'game-group/get-all',
  GET_DROPDOWN_GAME: 'games/get-all-games-no-icon',
  EXPORT_EXCEL: '',
}
@Component({
  selector: 'app-game-report',
  templateUrl: './game-report.component.html',
  styleUrls: ['./game-report.component.scss'],
})
export class GameReportComponent implements OnInit {
  sumPlayerCount = 0
  sumTxn = 0
  sumBet = 0
  sumValidBet = 0
  sumWinLoss = 0
  columns = [
    { header: 'Date', field: 'summarydate', footer: 'Total' },
    { header: '#Player', field: 'playercount', type: 'FooterNumber', footer: this.sumPlayerCount },
    { header: '#Txn', field: 'totaltxn', type: 'FooterNumber', footer: this.sumTxn },
    { header: 'Total Bets', field: 'totalbet', type: 'pipeNumber', footer: this.sumBet },
    { header: 'Valid bets', field: 'validbet', type: 'pipeNumber', footer: this.sumValidBet },
    { header: 'Win/Loss', field: 'totalwinloss', type: 'pipeNumber', footer: this.sumWinLoss },
    // { header: 'Payout (%)', field: 'payout' },
  ];
  dataInput = [];
  tr: any = this.columns.map((data) => {
    return data.field;
  });

  columnsGames = [
    { header: 'Provider', field: 'gameprovidername', footer: 'Total' },
    { header: 'Produtc Type', field: 'producttypename', },
    { header: 'Group', field: 'gamegroupname', },
    { header: 'Game ', field: 'gamename', },
    { header: '#Player', field: 'playercount', type: 'FooterNumber', footer: this.sumPlayerCount },
    { header: '#Txn', field: 'totaltxn', type: 'FooterNumber', footer: this.sumTxn },
    { header: 'Total Bets', field: 'totalbet', type: 'pipeNumber', footer: this.sumBet },
    { header: 'Valid bets', field: 'validbet', type: 'pipeNumber', footer: this.sumValidBet },
    { header: 'Win/Loss', field: 'totalwinloss', type: 'pipeNumber', footer: this.sumWinLoss },
    // { header: 'Payout (%)', field: 'payout' },
  ];
  dataInputGames = [];
  trGames: any = this.columnsGames.map((data) => {
    return data.field;
  });

  checkType = '1'
  checkSendApi = '1'
  dataLength: number = 0;
  dataPG: PaginateRequest = new PaginateRequest();

  // dataGameLength: number = 0;
  // dataGamePG: PaginateRequest = new PaginateRequest();

  form: FormGroup;
  rtData: PageChangeModel
  providerList = []
  productList = []
  groupList = []
  gameList = []
  tempDate = new Date();
  newDate = this.tempDate.setHours(0, 0, 0);
  tempDateWeek = new Date();
  tempDateWeekNewDay = this.tempDateWeek.setHours(0, 0, 0)
  tempDateWeekNewDayd = this.tempDateWeek.setDate(this.tempDateWeek.getDate() - 29)

  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 30,
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
    new Date().getMonth() - 1,
    1,
    0,
    0)
  // const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  lastDateM = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59)
  constructor(
    @Inject('API_URL') public api_url: string,
    private httpService: BaseService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      startDate: [this.firstDate],
      endDate: [this.lastDate],
      startDateM: [this.firstDateM],
      endDateM: [this.lastDateM],
      providerCode: ['ALL'],
      productCode: ['ALL'],
      gameGroupCode: ['ALL'],
      gameCode: ['ALL'],
    })
  }

  ngOnInit(): void {
    this.getDropdownProvider()
    this.getDropdownProduct()
    this.getDropdownGroup()
    this.getDropdownGame()
    this.getGameReport()
  }

  resetData() {
    this.form.controls.startDate.setValue(this.tempDateWeek)
    this.form.controls.endDate.setValue(this.tempDate)
    this.form.controls.providerCode.setValue('ALL')
    this.form.controls.productCode.setValue('ALL')
    this.form.controls.gameGroupCode.setValue('ALL')
    this.form.controls.gameCode.setValue('ALL')
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

  exportExcel() {
    // window.open(this.api_url + URL.EXPORT_EXCEL)
  }

  searchGameReport() {
    this.getGameReport()
    this.dataPG.page = 0
  }

  getGameReport() {
    let wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = 'created_date';
    wordFilter.op = 'between'
    if (this.checkType !== '2') {
      wordFilter.value = moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
      wordFilter.value1 = moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
      this.dataPG.filter.push(wordFilter)
    }
    else {
      wordFilter.value = moment(this.form.controls.startDateM.value).format('YYYY/MM/DD HH:mm:ss').toString()
      wordFilter.value1 = moment(this.form.controls.endDateM.value).format('YYYY/MM/DD HH:mm:ss').toString()
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.providerCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'AND g.provider_code'
      wordFilter.op = '='
      wordFilter.value = this.form.controls.providerCode.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.productCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'AND g.game_product_type_code'
      wordFilter.op = '='
      wordFilter.value = this.form.controls.productCode.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.gameGroupCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'AND g.game_group_code'
      wordFilter.op = '='
      wordFilter.value = this.form.controls.gameGroupCode.value
      this.dataPG.filter.push(wordFilter)
    }
    if (this.form.controls.gameCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'AND g.game_code'
      wordFilter.op = '='
      wordFilter.value = this.form.controls.gameCode.value
      this.dataPG.filter.push(wordFilter)
    }
    this.checkSendApi = this.checkType

    if (this.checkType == '1') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'GROUP BY CAST';
      wordFilter.op = 'GROUP BY'
      wordFilter.value = '(tg.created_date as Date)'
      this.dataPG.filter.push(wordFilter)
    } else if (this.checkType == '2') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'GROUP BY';
      wordFilter.op = 'GROUP BY'
      wordFilter.value = 'format(created_date,\'yyyy-MM\')';
      this.dataPG.filter.push(wordFilter)
    }
    else {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'GROUP BY';
      wordFilter.op = 'GROUP BY'
      wordFilter.value = 'g.provider_code,gp.name_en, g.game_product_type_code, gpt.name_en , g.game_group_code,gg.name_en , g.game_code ,g.display_name';
      this.dataPG.filter.push(wordFilter)
    }

    if (this.checkType === '1') {
      this.httpService.doPost(URL.GET_REPORT_DAILY, this.dataPG).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          console.log(res.data);
          this.dataInput = res.data.dataList.data.map(data => {
            return {
              summarydate: data.summarydate,
              playercount: data.playercount,
              totaltxn: data.totaltxn,
              totalbet: data.totalbet,
              validbet: data.validbet,
              totalwinloss: data.totalwinloss,
            }
          })
          this.columns[1].footer = res.data.summary.playercount
          this.columns[2].footer = res.data.summary.totaltxn
          this.columns[3].footer = res.data.summary.totalbet
          this.columns[4].footer = res.data.summary.validbet
          this.columns[5].footer = res.data.summary.totalwinloss
          this.dataLength = res.data.dataList.recordsTotal
        }
        this.dataPG.filter = []
      })
    } else if (this.checkType === '2') {
      this.httpService.doPost(URL.GET_REPORT_MONTHLY, this.dataPG).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          console.log(res.data);
          this.dataInput = res.data.dataList.data.map(data => {
            return {
              summarydate: data.summarydate,
              playercount: data.playercount,
              totaltxn: data.totaltxn,
              totalbet: data.totalbet,
              validbet: data.validbet,
              totalwinloss: data.totalwinloss,
            }
          })
          this.columns[1].footer = res.data.summary.playercount
          this.columns[2].footer = res.data.summary.totaltxn
          this.columns[3].footer = res.data.summary.totalbet
          this.columns[4].footer = res.data.summary.validbet
          this.columns[5].footer = res.data.summary.totalwinloss
          this.dataLength = res.data.dataList.recordsTotal
        }
        this.dataPG.filter = []
      })
    }
    else {
      this.httpService.doPost(URL.GET_REPORT_GAME, this.dataPG).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.dataInputGames = res.data.dataList.data.map(data => {
            return {
              gameprovidername: data.gameprovidername,
              producttypename: data.producttypename,
              gamegroupname: data.gamegroupname,
              gamename: data.gamename,
              playercount: data.playercount,
              totaltxn: data.totaltxn,
              totalbet: data.totalbet,
              validbet: data.validbet,
              totalwinloss: data.totalwinloss,
            }
          })
          this.columnsGames[4].footer = res.data.summary.playercount
          this.columnsGames[5].footer = res.data.summary.totaltxn
          this.columnsGames[6].footer = res.data.summary.totalbet
          this.columnsGames[7].footer = res.data.summary.validbet
          this.columnsGames[8].footer = res.data.summary.totalwinloss
          this.dataLength = res.data.dataList.recordsTotal
        }
        this.dataPG.filter = []
      })
    }
  }

  pageChange(event: PageChangeModel) {
    console.log(event);
    this.dataPG.page = event.pageIndex
    this.dataPG.length = event.pageSize
    this.getGameReport()
  }

  sortChange(event: SortChangeModel) {
    this.dataPG.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.dataPG.sort.push(sort)
    }
    this.getGameReport()
  }

  changeType(event) {
    this.checkType = event
    //     var date = new Date();
    // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

