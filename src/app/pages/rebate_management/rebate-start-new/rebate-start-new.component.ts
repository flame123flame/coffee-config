import { Component, OnInit } from '@angular/core';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { FilterOp, PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  STAT_PAGINATE_TITLE: 'rebate/stat-paginate-title',
  STAT_PAGINATE_DAILY: 'rebate/stat-paginate-month',
  STAT_PAGINATE_MONTH: 'rebate/stat-paginate-daily',
}
@Component({
  selector: 'app-rebate-start-new',
  templateUrl: './rebate-start-new.component.html',
  styleUrls: ['./rebate-start-new.component.scss']
})
export class RebateStartNewComponent implements OnInit {
  dailyMonthCol = [
    { header: 'Date', field: 'date_time' },
    { header: 'Valid Bets', field: 'sum(rh.valid_bets)' },
    { header: 'Original Rebate', field: 'sum(rh.original_rebate)' },
    { header: 'Actual Rebate', field: 'sum(rh.actual_rebate)' },
    { header: 'Count', field: 'count' },
  ]
  dailyMonthTr = [
    'date_time',
    'sum(rh.valid_bets)',
    'sum(rh.original_rebate)',
    'sum(rh.actual_rebate)',
    'count',
  ]
  titleCol = [
    { header: 'Title', field: 'rh.rebate_title' },
    { header: 'Valid Bets', field: 'sum(rh.valid_bets)' },
    { header: 'Original Rebate', field: 'sum(rh.original_rebate)' },
    { header: 'Actual Rebate', field: 'sum(rh.actual_rebate)' },
  ]
  titleTr = [
    'rh.rebate_title',
    'sum(rh.valid_bets)',
    'sum(rh.original_rebate)',
    'sum(rh.actual_rebate)',
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

  ngOnInit(): void { }

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
            'sum(rh.valid_bets)': ele.validBets,
            'sum(rh.original_rebate)': ele.originalRebate,
            'sum(rh.actual_rebate)': ele.actualRebate,
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
            'sum(rh.valid_bets)': ele.validBets,
            'sum(rh.original_rebate)': ele.originalRebate,
            'sum(rh.actual_rebate)': ele.actualRebate,
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
            'rh.rebate_title': ele.title,
            'sum(rh.valid_bets)': ele.validBets,
            'sum(rh.original_rebate)': ele.actualRebate,
            'sum(rh.actual_rebate)': ele.originalRebate,
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
      filter.column = 'rh.created_date'
      filter.op = '>='
      filter.value = this.searchForm.fromDate
      this.param.filter.push(filter)
    }
    if (this.searchForm.toDate) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'rh.created_date'
      filter.op = '<='
      filter.value = this.searchForm.toDate
      this.param.filter.push(filter)
    }
    if (this.searchForm.title) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'rh.rebate_title'
      filter.op = FilterOp.CONTAIN
      filter.value = this.searchForm.title
      this.param.filter.push(filter)
    }

    this.loadListSwitch();

  }

  loadListSwitch() {
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
