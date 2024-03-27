import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  GET_ALL: 'rebate-history/paginate',
  GET_CAL: 'rebate-history/get-calculat'
}
@Component({
  selector: 'app-rebate-history-new',
  templateUrl: './rebate-history-new.component.html',
  styleUrls: ['./rebate-history-new.component.scss']
})
export class RebateHistoryNewComponent implements OnInit {
  columns = [
    {
      header: 'Audit Date',
      field: 'createdDate',
    },
    {
      header: 'Player ID',
      field: 'username',
    },

    {
      header: 'Player Group',
      field: 'groupName',
    },
    {
      header: 'Rebate Title',
      field: 'rebateTitle',
    },
    {
      header: 'Auto Rebate',
      field: 'isAutoRebate',
    },
    {
      header: 'Valid Bets',
      field: 'validBets',
    },
    {
      header: 'Original Rebate',
      field: 'originalRebate',
    },
    {
      header: 'Actual Rebate',
      field: 'actualRebate',
    },
    {
      header: 'Note',
      field: 'remark',
    },
    {
      header: 'Auditor',
      field: 'createdBy',
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter'
    },
  ];

  tr: any = [
    'createdDate',
    'username',
    'groupName',
    'rebateTitle',
    'isAutoRebate',
    'validBets',
    'originalRebate',
    'actualRebate',
    'remark',
    'createdBy',
    'status',

  ];
  dataInput = [];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';

  constructor(
    private router: Router,
    private httpService: BaseService) { }

  ngOnInit(): void { this.loadList(); }

  loadList() {
    this.httpService.doPost(URL.GET_ALL, this.paginateReq).subscribe(res => {
      console.log(res.data);
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.data.map(data => {
          return {
            createdDate: data.createdDate,
            username: data.username,
            groupName: data.groupName,
            rebateTitle: data.rebateTitle,
            isAutoRebate: data.isAutoRebate = true ? "Yes" : "No",
            validBets: data.validBets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            originalRebate: data.originalRebate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            actualRebate: data.actualRebate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            remark: data.remark,
            createdBy: data.createdBy,
            status: data.status = true ? "Approved" : "Declined",
          }

        })
        this.length = res.data.recordsTotal;

      }
    });
  }

  length: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest({
    sort: [{
      column: "rh.created_date",
      order: "desc",
    }]
  });

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
    // if (this.periodType != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'p.promo_period_type';
    //   filter.op = '=';
    //   filter.value = this.periodType;
    //   this.paginateReq.filter.push(filter);
    // }
    // if (this.promoCategory != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'p.promo_type';
    //   filter.op = '=';
    //   filter.value = this.promoCategory;
    //   this.paginateReq.filter.push(filter);
    // }
    // if (this.promoTitle != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'p.promo_title';
    //   filter.op = 'contain';
    //   filter.value = this.promoTitle;
    //   this.paginateReq.filter.push(filter);
    // }
    this.loadList();
  }

  syncRebate() {
    this.httpService.doGet(URL.GET_CAL).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        alert(res.status)
        this.loadList();
      }
    })
  }
}
