import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { PaginateRespond, RequestRespond } from 'src/app/models/RequestRespond';
import { BaseService } from 'src/app/service/BaseService.service';
import { resData } from '../../rebate_management/rebate-setting-new-add/rebate-setting-new-add.component';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import * as moment from'moment'
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
interface search{
  dateStart:Date,
  dateEnd:Date,
  conditionType:String,
  status:String,
  playerStatus:String,
  username:String,
  pass:String
}
const URL = {
  GET_PAGINATE: "withdraw-condition/get-withdraw-condition",
}
@Component({
  selector: 'app-withdrawal-condition',
  templateUrl: './withdrawal-condition.component.html',
  styleUrls: ['./withdrawal-condition.component.scss']
})
export class WithdrawalConditionComponent implements OnInit {
  search:search={
    conditionType:null,
    dateEnd:null,
    dateStart:null,
    pass:null,
    playerStatus:null,
    status:null,
    username:null,
  }
  columns: any = [
    {
      header: '#',
      field: 'id',
    },
    { header: 'Date', field: 'createdDate' },
    {
      header: 'Player ID',
      field: 'username',
    },
    {
      header: 'Condition Type',
      field: 'conditionType',
    },
    {
      header: 'Deposit Amt.',
      field: 'amount',
      type: 'pipeNumber'
    },
    {
      header: 'Valid bet.',
      field: 'currentTurnover',
      type: 'pipeNumber'
    },
    {
      header: 'Valid bet condition .',
      field: 'targetTurnover',
      type: 'pipeNumber'
    },
    {
      header: 'Condition Status.',
      field: 'conditionStatus'
    },
    {
      header: 'Bonus Amt.',
      field: 'bonusAmount',
      type: 'pipeNumber'
    },
  ];

  tr: any = [
    'no',
    'createdDate',
    'username',
    'conditionType',
    'amount',
    'currentTurnover',
    'targetTurnover',
    'bonusAmount',
    'conditionStatus',
    'action',
  ];
  actionSetting = new ActionSetting({
    hideEdit: true,
    hideDelete: false,
  });
  data: any = []
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';
  selected6 = '1';
  selected7 = '1';
  selected8 = '1';
  length = 0;
  paginateReq: PaginateRequest = new PaginateRequest();
  constructor(private router: Router, private baseSer: BaseService,) { }

  ngOnInit(): void {
    this.getPaginate()
  }
  getPaginate() {
    this.paginateReq.sort = []
    let sort: PaginateSort = new PaginateSort();
    sort.column = 'tb.created_date'
    sort.order = 'desc'
    this.paginateReq.sort.push(sort)
    // this.paginateReq.filter.
    this.setFilter()
    this.baseSer.doPost(URL.GET_PAGINATE, this.paginateReq).subscribe((res: RequestRespond<PaginateRespond<resData>>) => {
      if (res.status == "SUCCESS") {
        this.data = res.data.data;
        this.data.forEach(element => {
          element.createdDate = moment(element.createdDate).format("DD/MM/yyyy")
        });
        this.length = res.data.recordsTotal;
      }
    })
  }
  setFilter() {
    this.paginateReq.filter = []
    if (this.search.dateStart&&this.search.dateEnd) {
      let data: PaginateFilter = { column: "created_date", op: "between", value: this.search.dateStart,value1: this.search.dateEnd }
      this.paginateReq.filter.push(data)
    }
    if (this.search.conditionType) {
      let data: PaginateFilter = { column: "condition_type", op: "contain", value: this.search.conditionType.toString() }
      this.paginateReq.filter.push(data)
    }
    if (this.search.pass) {
      let data: PaginateFilter = { column: "condition_status", op: "contain", value: this.search.pass.toString() }
      this.paginateReq.filter.push(data)
    }
    if (this.search.username) {
      let data: PaginateFilter = { column: "username", op: "contain", value: this.search.username.toString() }
      this.paginateReq.filter.push(data)
    }
  }
  resetFilter(){
    this.search = {
      dateStart: null,
      dateEnd: null,
      username: null,
      conditionType:null,
      pass:null,
      playerStatus:null,
      status:null,
    }
    this.getPaginate()
  }
  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex
    this.paginateReq.length = event.pageSize
    this.getPaginate()
  }
  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.paginateReq.sort.push(sort)
    }
    this.getPaginate()
  }
}
