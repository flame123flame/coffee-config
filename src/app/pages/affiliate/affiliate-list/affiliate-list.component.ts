import { Router } from '@angular/router';
import {
  PaginateFilter,
  PaginateRequest,
  PaginateSort,
} from './../../../models/PaginateRequest';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  PageChangeModel,
  SortChangeModel,
} from 'src/app/models/MatTableChange';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { MessageService } from 'src/app/service/message.service';

const URL = {
  AFFILIATE: 'affiliate',
  AFFILIATE_GETALL: 'affiliate/get-all',
  AFFILIATE_PAGINATE: 'affiliate/get-all-pagniate',
  AFFILIATE_GET_CUS: 'affiliate/get-customer-detail',
};

interface Customer {
  id: number;
  username: string;
  mobilePhone: string;
  realName: string;
  bankCode: string;
  bankNameEn?: any;
  bankNameTh?: any;
  bankAccount: string;
  bankImg?: any;
  groupCode: string;
  groupName: string;
  tagCode?: any;
  tagName: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: any;
  updatedDate: string;
  enable: boolean;
  lastLoginDate: string;
  loginStatus: boolean;
  balance?: any;
  bonus?: any;
  pendingWithdrawal?: any;
  affiliateCode?: any;
  affiliateCodeUp?: any;
  registerDate?: any;
}

class dataTable {
  affiliateId: string;
  username: string;
  realName: string;
  upLineName: string;
  downLine: number;
}
interface AffiliateNetworkList {
  id: number;
  username: string;
  affiliateCode: string;
  affiliateCodeUp: string;
  registerDate: Date;
}

interface getAllRes {
  id?: number;
  username: string;
  affiliateCode: string;
  affiliateGroupCode?: any;
  groupName?: any;
  detail: string;
  banner?: any;
  clickCount: number;
  totalIncome?: any;
  income?: any;
  pendingWithdraw?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
  affiliateCodeUp?: any;
  affiliateNetworkList: AffiliateNetworkList[];
  channelDetailList?: any;
  selfDetail?: Customer;
  upLineDetail?: Customer;
}

@Component({
  selector: 'app-affiliate-list',
  templateUrl: './affiliate-list.component.html',
  styleUrls: ['./affiliate-list.component.scss'],
})
export class AffiliateListComponent implements OnInit {
  columns = [
    {
      header: 'Affiliate Id',
      field: 'affiliateId',
      type: 'link',
      onClick: (event) => {
        this.route.navigate([`affiliate/affiliate-profile`], {
          queryParams: {
            affiliateCode: event.affiliateId,
          },
        });
      },
    },
    {
      header: 'Username',
      field: 'username',
      type: 'link',
      onClick: (event) => {
        this.route.navigate([`player-management/player-list/player-profile`], {
          queryParams: {
            username: event.username,
          },
        });
      },
    },
    { header: 'Real Name', field: 'realName' },
    {
      header: 'Upline',
      field: 'upLineName',
      type: 'link',
      onClick: (event) => {
        event.upLineName == 'ไม่มี'
          ? null
          : this.route.navigate(
              [`player-management/player-list/player-profile`],
              {
                queryParams: {
                  username: event.upLineName,
                },
              }
            );
      },
    },
    {
      header: 'Down Line',
      field: 'downLine',
      type: 'linkNumber',
      onClick: (event) => {
        event.upLineName == 'ไม่มี'
          ? null
          : this.route.navigate(
              [`player-management/player-list/player-profile`],
              {
                queryParams: {
                  username: event.upLineName,
                },
              }
            );
      },
    },
  ];
  formFilter: FormGroup;
  affiliateSelect: any[] = [
    { name: 'Affiliate ID', value: 'affiliate_code' },
    { name: 'Player ID', value: 'username' },
    { name: 'Real Name', value: 'real_name' },
    { name: 'Upline Player ID', value: 'affiliateCodeUp' },
  ];
  dataInput: dataTable[] = [];
  tr: any = ['affiliateId', 'username', 'realName', 'upLineName', 'downLine'];
  constructor(
    private httpSer: BaseService,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.createFrom();
  }

  ngOnInit(): void {
    this.loadList();
  }

  length: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest();

  loadList() {
    this.httpSer
      .doPost(URL.AFFILIATE_PAGINATE, this.paginateReq)
      .subscribe((res: RequestPaginateRespond<getAllRes>) => {
        if (res.status == MessageService.MSG.SUCCESS) {
          this.dataInput = res.data.data.map((ele) => {
            return {
              affiliateId: ele.affiliateCode,
              realName: ele.selfDetail.realName,
              username: ele.selfDetail.username,
              upLineName: ele.upLineDetail
                ? ele.upLineDetail.username
                : 'ไม่มี',
              downLine: ele.affiliateNetworkList.length,
            };
          });
          this.length = res.data.recordsTotal;
        }
      });
  }

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex;
    this.paginateReq.length = event.pageSize;
    this.loadList();
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = [];
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateReq.sort.push(sort);
    }
    this.loadList();
  }

  filter() {
    this.paginateReq.filter = [];
    if (this.formFilter != null) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = this.formFilter.get('columValue').value;
      filter.op = '=';
      filter.value = this.formFilter.get('columValue').value;
      this.paginateReq.filter.push(filter);
    }
    this.loadList();
  }

  resetSearch() {
    this.formFilter = this.fb.group({
      selectCol: [null],
      columValue: [null],
    });
  }

  createFrom() {
    this.formFilter = this.fb.group({
      selectCol: [null],
      columValue: [null],
    });
  }
}
