import { Component, OnInit } from '@angular/core';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { FilterOp, PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';


const URL = {
  STAT_PAGINATE_TITLE: 'cashback/stat-paginate-title',
  STAT_PAGINATE_DAILY: 'cashback/stat-paginate-month',
  STAT_PAGINATE_MONTH: 'cashback/stat-paginate-daily',
}
@Component({
  selector: 'app-cashback-start-new',
  templateUrl: './cashback-start-new.component.html',
  styleUrls: ['./cashback-start-new.component.scss']
})
export class CashbackStartNewComponent implements OnInit {

  dailyMonthCol = [
    { header: 'Date', field: 'date_time' },
    { header: 'Total Loss', field: 'sum(rh.total_loss)' },
    { header: 'Original Cashback', field: 'sum(rh.original_cashback)' },
    { header: 'Actual Cashback', field: 'sum(rh.actual_cashback)' },
    { header: 'Count', field: 'count' },
  ]
  dailyMonthTr = [
    'date_time',
    'sum(rh.total_loss)',
    'sum(rh.original_cashback)',
    'sum(rh.actual_cashback)',
    'count',
  ]
  titleCol = [
    { header: 'Title', field: 'rh.cashback_title' },
    { header: 'Valid Bets', field: 'sum(rh.total_loss)' },
    { header: 'Original Rebate', field: 'sum(rh.original_cashback)' },
    { header: 'Actual Rebate', field: 'sum(rh.actual_cashback)' },
  ]
  titleTr = [
    'rh.cashback_title',
    'sum(rh.total_loss)',
    'sum(rh.original_cashback)',
    'sum(rh.actual_cashback)',
  ]

  reportByList = [
    { value: 'title', display: 'title' },
    { value: 'daily', display: 'daily' },
    { value: 'month', display: 'month' }
  ]

  searchForm = {
    title: null,
    fromDate: null,
    toDate: null,
    reportBy: 'title',
  }

  columns: any = [];
  tr: any = [];
  data: any = [];


  constructor(private httpService: BaseService) {
    this.getStatPaginateTitle();
  }

  ngOnInit(): void {}


  param: PaginateRequest = new PaginateRequest();
  length: number = 0;
  getStatPaginateDaily() {
    this.tr = this.dailyMonthTr;
    this.columns = this.dailyMonthCol;
    this.httpService.doPost(URL.STAT_PAGINATE_DAILY, this.param).subscribe(data => {
      if (data.status == "SUCCESS") {
        this.length = data.data.length
        this.data = data.data.data.map(ele => {
          return {
            'date_time': ele.dateTime,
            'sum(rh.total_loss)': ele.totalLoss,
            'sum(rh.original_cashback)': ele.originalCashback,
            'sum(rh.actual_cashback)': ele.actualCashback,
            'count': ele.count,
          }
        })
      }
    })
  }

  getStatPaginateMonth() {
    this.tr = this.dailyMonthTr;
    this.columns = this.dailyMonthCol;
    this.httpService.doPost(URL.STAT_PAGINATE_MONTH, this.param).subscribe(data => {
      if (data.status == "SUCCESS") {
        this.length = data.data.length
        this.data = data.data.data.map(ele => {
          return {
            'date_time': ele.dateTime,
            'sum(rh.total_loss)': ele.totalLoss,
            'sum(rh.original_cashback)': ele.originalCashback,
            'sum(rh.actual_cashback)': ele.actualCashback,
            'count': ele.count,
          }
        })
      }
    })
  }

  getStatPaginateTitle() {
    this.tr = this.titleTr;
    this.columns = this.titleCol;
    this.httpService.doPost(URL.STAT_PAGINATE_TITLE, this.param).subscribe(data => {
      if (data.status == "SUCCESS") {
        this.length = data.data.length
        this.data = data.data.data.map(ele => {
          return {
            'rh.cashback_title': ele.cashbackTitle,
            'sum(rh.total_loss)': ele.totalLoss,
            'sum(rh.original_cashback)': ele.actualCashback,
            'sum(rh.actual_cashback)': ele.originalCashback,
          }
        })
      }
    })
  }

  actionSetting: ActionSetting = new ActionSetting()

  search() {
    this.param.filter = []
    this.param.sort = []
    if (this.searchForm.fromDate) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'ch.created_date'
      filter.op = '>='
      filter.value = this.searchForm.fromDate
      this.param.filter.push(filter)
    }
    if (this.searchForm.toDate) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'ch.created_date'
      filter.op = '<='
      filter.value = this.searchForm.toDate
      this.param.filter.push(filter)
    }
    if (this.searchForm.title) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'ch.cashback_title'
      filter.op = FilterOp.CONTAIN
      filter.value = this.searchForm.title
      this.param.filter.push(filter)
    }
    this.loadListSwitch();
  }

  loadListSwitch() {
    console.log(this.searchForm.reportBy)
    switch (this.searchForm.reportBy) {
      case 'title':
        this.getStatPaginateTitle();
        return;
        break;
      case 'daily':
        this.getStatPaginateDaily();
        return;
        break;
      case 'month':
        this.getStatPaginateMonth();
        return;
        break;
    }
  }

  reset() {
    this.searchForm = {
      title: null,
      fromDate: null,
      toDate: null,
      reportBy: 'title',
    }
  }

  pageChange(event: PageChangeModel) {
    this.param.page = event.pageIndex
    this.param.length = event.pageSize
    this.loadListSwitch();
  }

  sortChange(event: SortChangeModel) {
    this.param.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.param.sort.push(sort)
    }
    this.loadListSwitch();
  }
}