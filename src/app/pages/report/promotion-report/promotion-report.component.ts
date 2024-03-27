import { BaseService } from 'src/app/service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  PageChangeModel,
  SortChangeModel,
} from 'src/app/models/MatTableChange';
import {
  FilterOp,
  PaginateFilter,
  PaginateRequest,
  PaginateSort,
} from 'src/app/models/PaginateRequest';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { MessageService } from 'src/app/service/message.service';
import { FormBuilder, FormGroup } from '@angular/forms';
const URL = {
  GET_PAGINATE: 'promotion-report/paginate',
};

interface PrmotionDatatable {
  id: number;
  promoCode: string;
  promoTitle: string;
  promoType: string;
  appPlatform: string;
  promoPeriodType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  viewStatus: string;
  updatedBy?: any;
  updatedDate?: any;
  createdBy: string;
  createdDate: Date;
  rejectCount: number;
  approveCount: number;
  allCount: number;
}
@Component({
  selector: 'app-promotion-report',
  templateUrl: './promotion-report.component.html',
  styleUrls: ['./promotion-report.component.scss'],
})
export class PromotionReportComponent implements OnInit {
  columns = [
    { header: 'Promotion Title', field: 'promoTitle' },
    { header: 'Promotion Period', field: 'promotionPeriod' },
    { header: 'Promotion Type', field: 'promoType' },
    // { header: 'Promotion Tag', field: 'promoTag' },
    { header: 'Application Count', field: 'applicationCount' },
    { header: 'Approve Decline Count', field: 'approveDeclineCount' },
    { header: 'Approval Rate', field: 'approvalRate' },
  ];

  dataInput = [];

  tr: any = this.columns.map((data) => {
    return data.field;
  });

  periodTypeList: any[] = [
    {
      display: 'Indefinite',
      value: 'Indefinite',
    },
    {
      display: 'Date Period',
      value: 'DatePeriod',
    },
  ];
  promotionCategoryList: any[] = [
    {
      display: 'Customized',
      value: 'Customized',
    },
    {
      display: '1st&2nd Deposit',
      value: '1st&2ndDeposit',
    },
    {
      display: 'General Deposit',
      value: 'GeneralDeposit',
    },
    {
      display: 'Promotion Posting',
      value: 'Promotion Posting',
    },
    {
      display: 'Registration',
      value: 'Registration',
    },
  ];
  form: FormGroup;

  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 61,
    0, 0);
  lastDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59
  );
  maxDate = new Date(new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59)
  constructor(
    private baseSer: BaseService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      periodType: ['ALL'],
      startDate: [this.firstDate],
      endDate: [this.lastDate],
      promoCategory: ['ALL'],
      promoTitle: [null],
    })
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.filter()
    this.baseSer
      .doPost(URL.GET_PAGINATE, this.paginateReq)
      .subscribe((res: RequestPaginateRespond<PrmotionDatatable>) => {
        if (res.status == MessageService.MSG.SUCCESS) {
          this.dataInput = res.data.data.map((ele) => {
            return {
              promoTitle: ele.promoTitle,
              promotionPeriod: ele.promoPeriodType,
              promoType: ele.promoType,
              promoTag: '',
              applicationCount: ele.allCount,
              approveDeclineCount: `${ele.approveCount}/${ele.rejectCount}`,
              approvalRate: `${ele.allCount == 0 ? 0 : (ele.approveCount / ele.allCount) * 100
                }%`,
            };
          });
          this.length = res.data.recordsTotal;
        }
      });
  }

  length: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest();

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
    this.paginateReq.filter = []
    let wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = '';
    wordFilter.op = ''
    wordFilter.value = moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    wordFilter.value1 = moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    this.paginateReq.filter.push(wordFilter)

    if (this.form.controls.periodType.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'p.promo_period_type';
      wordFilter.op = FilterOp.EQUAL
      wordFilter.value = this.form.controls.periodType.value
      this.paginateReq.filter.push(wordFilter)
    }
    if (this.form.controls.promoCategory.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'p.promo_type';
      wordFilter.op = FilterOp.EQUAL
      wordFilter.value = this.form.controls.promoCategory.value
      this.paginateReq.filter.push(wordFilter)
    }
    if (this.form.controls.promoTitle.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'p.promo_title';
      wordFilter.op = FilterOp.CONTAIN
      wordFilter.value = this.form.controls.promoTitle.value
      this.paginateReq.filter.push(wordFilter)
    }
  }

  resetSearch() {
    this.form.controls.startDate.setValue(this.firstDate)
    this.form.controls.endDate.setValue(this.lastDate)
    this.form.controls.periodType.setValue('ALL')
    this.form.controls.promoCategory.setValue('ALL')
    this.form.controls.promoTitle.setValue(null)
  }
}
