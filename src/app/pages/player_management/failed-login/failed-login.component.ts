import { browser } from 'protractor';
import { url } from 'inspector';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';

const URL = {
  PAGINATE: 'failed-login/paginate',
  GET_CUSTOMER: 'customer/get-customer-all',
}

export interface paginateData {
  id: number;
  failedLoginCode: string;
  username: string;
  realName: string;
  remark: boolean;
  lastFailedLogin: Date;
  country: string;
  countFailedLogin: number;
  ipAddress: string;
  platform: string;
  browserName: string;
  browserVersion: string;
  create: string;
}
@Component({
  selector: 'app-failed-login',
  templateUrl: './failed-login.component.html',
  styleUrls: ['./failed-login.component.scss'],
})
export class FailedLoginComponent implements OnInit {
  dataLength: number = 0;
  columns = [
    {
      header: 'Player ID',
      field: 'username',
    },
    {
      header: 'Real Name',
      field: 'realName',
    },
    {
      header: 'Remark',
      field: 'remark',
    },

    {
      header: 'Last Failed Login',
      field: 'lastFailedLogin',
      type: 'textCenter',
    },
    {
      header: 'Country',
      field: 'country',
    },
    {
      header: 'Counts',
      field: 'countFailedLogin',
      type: 'textNumber'
    },
    {
      header: 'IP Address',
      field: 'ipAddress',
    },
    {
      header: 'Platform',
      field: 'platform',
    },
    {
      header: 'Browser/Version',
      field: 'browser',
    },
  ];


  tr: any = [
    'username',
    'realName',
    'remark',
    'lastFailedLogin',
    'country',
    'countFailedLogin',
    'ipAddress',
    'platform',
    'browser',
  ];
  paginateReq: PaginateRequest = new PaginateRequest();
  dataInputX = [];
  customerList = [];
  searchModel = {
    username: '',
    realName: '',
    remark: '',
    lastFailedLoginStart: '',
    lastFailedLoginEnd: '',
    country: '',
    platform: '',
    browserName: '',
  }
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
    this.loadList();
    this.getCustomerList();
  }

  loadList() {
    this.setSearch();
    this.baseService.doPost(URL.PAGINATE, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
      if (res.status == MessageService.MSG.SUCCESS) {
        this.dataInputX = res.data.data;
        this.dataLength = res.data.recordsTotal;
        // console.log(this.dataInputX);
        this.dataInputX.forEach(item => {
          item.lastFailedLogin = moment(item.lastFailedLogin).format('DD/MM/YYYY HH:mm:ss');
          item.browser = item.browserName && item.browserVersion != null ? item.browserName + '/' + item.browserVersion : ' ';
        });

      }
    })
  }

  getCustomerList() {
    this.baseService.doGet(URL.GET_CUSTOMER).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.customerList = res.data;
      }
      console.log(res.data);
    });
  }

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex;
    this.paginateReq.length = event.pageSize;
    this.loadList();
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = [{ column: "created_date", order: "desc" }]
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateReq.sort.push(sort)
    }
    this.loadList();
  }


  setSearch() {
    console.log(this.searchModel);

    this.paginateReq.filter = [];
    if (this.searchModel.username) {
      this.paginateReq.filter.push({ column: 'tb.username', op: 'contain', value: this.searchModel.username.trim(), value1: '' });
    }
    if (this.searchModel.realName) {
      this.paginateReq.filter.push({ column: 'tb.real_name', op: 'contain', value: this.searchModel.realName.trim(), value1: '' });
    }
    if (this.searchModel.remark) {
      this.paginateReq.filter.push({ column: 'tb.remark', op: 'contain', value: this.searchModel.remark.trim(), value1: '' });
    }
    if (this.searchModel.lastFailedLoginStart && this.searchModel.lastFailedLoginEnd) {
      this.paginateReq.filter.push({ column: 'tb.created_date', op: 'between', value: this.searchModel.lastFailedLoginStart, value1: this.searchModel.lastFailedLoginEnd });
    }
    if (this.searchModel.country) {
      this.paginateReq.filter.push({ column: 'tb.country', op: 'contain', value: this.searchModel.country.trim(), value1: '' });
    }
    if (this.searchModel.platform) {
      this.paginateReq.filter.push({ column: 'tb.platform', op: 'contain', value: this.searchModel.platform.trim(), value1: '' });
    }
    if (this.searchModel.browserName) {
      this.paginateReq.filter.push({ column: 'tb.browser_name', op: 'contain', value: this.searchModel.browserName.trim(), value1: '' });
    }

  }
}
