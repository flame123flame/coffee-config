import { Component, OnInit } from '@angular/core';
import { BeanService } from './../../../service/BeanService.service';
import { SocketService } from './../../../service/SocketService.service';
import { ActionSetting, EditIcon } from 'src/app/models/ActionSettingModel';
import { Router } from '@angular/router';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { LottoConstants } from '../lotto-constants/lotto-constants';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { groupBy } from 'rxjs/operators';
import * as moment from 'moment';

const URL = {
  GET_DASHBOARD: 'dashboard/get-dashboard',
  GET_CLASS_CODE_BY: 'lotto-class/get-lotto-class',
  GET_ALL_INSTALLMENT: "lotto-report/get-all-lotto-installment",
  GET_PAGINATE_LOTTO_OTHER: "lotto-report/paginate-report-dashboard",
  GET_PAGINATE_LOTTO_YEEKEE: "lotto-report/paginate-report-dashboard-yeekee",
  GET_ROUND_ON_SUBMIT: 'lotto-transaction/get-yeekee-round-by-installment',
  GET_INSTALLMENT_ON_LOTTO_TRANSACTION: 'lotto-transaction/get-lotto-transaction-by-class-code/',


};

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

interface lottoClass {
  lottoClassCode: string;
  className: string;
  roundYeekee: Number;
}

// interface table {

//   installment: string
// }


@Component({
  selector: 'app-lotto-report',
  templateUrl: './lotto-report.component.html',
  styleUrls: ['./lotto-report.component.scss']
})
export class LottoReportComponent implements OnInit {

  actionSetting: ActionSetting = new ActionSetting({})

  lottoClassList: lottoClass[] = [];
  installList = [];
  data: any = null;
  // data1: table[] = [];

  //======= filter ======= 
  searchModel = {
    installment: '',
    // roundYeekee: '',
  }
  roundList = [];
  filterInstallmentList: any[] = [];
  isYekee = false;
  paginateClassCode = '';
  lottoClassName = '';
  categoryYeekee = '';
  //======= filter ======= 

  dataPaginateList = [];
  dataLength = 0;
  paginateReq: PaginateRequest = new PaginateRequest();
  constructor(
    private beanSer: BeanService,
    private httpSer: BeanService,
    private socket: SocketService,
    private router: Router

  ) {
    this.actionSetting.hideDetail = false
    this.actionSetting.hideDelete = false
    this.actionSetting.hideEdit = false

    this.actionSetting.listIcon = []
    let Icon1: EditIcon = new EditIcon()
    Icon1.icon = 'visibility'
    Icon1.color = '#86dbe3'
    Icon1.action = (data) => {
      this.goToView(data)
    }
    this.actionSetting.listIcon.push(Icon1)
    // console.log(this.actionSetting)
  }


  columns: any = [
    { header: 'Installment', field: 'installment' },
    { header: 'Round', field: 'roundYeekee' },
    { header: 'ClassCode', field: 'classCode' },


  ];

  tr: any = [
    'installment',
    // 'roundYeekee',
    'action'
  ];

  classCode = 0;
  categoryList = [
    { display: 'Government', value: 'GOVERNMENT' },
    { display: 'Stock', value: 'STOCKS' },
    { display: 'Yeekee', value: 'YEEKEE' }
  ];
  categoryCode = 0;
  sumPrize = 0;

  ngOnInit(): void {
    this.loadList(null);
    // this.getPaginate()
    // this.socket.initConnect();

    this.socket.postList.subscribe(data => {
      // console.log('LottoDashboardComponent -> ngOnInit -> data', data);
      if (data && data.lottoClassCode == this.lottoClassList[this.categoryCode].lottoClassCode) {
        this.data = data;
      } else {
        this.data = null;
      }
      this.sumPrize = 0;
      (this?.data?.lottoList ?? []).forEach(kind => {
        this.sumPrize += (kind?.prizeList ? kind?.prizeList[0] : [])?.sumPrizeCost ?? 0;
      });
    });
    this.getClassCode(this.categoryList[this.classCode].value);
  }


  getClassCode(classCode) {
    this.checkYeekee(classCode);
    this.lottoClassList = [];
    this.data = null;
    this.beanSer.doGet(`${URL.GET_CLASS_CODE_BY}/${classCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.lottoClassList = data.data;
        if (this.lottoClassList.length != 0) {
          this.categoryCode = 0;
          this.getDashboard(this.categoryCode, this.lottoClassList[this.categoryCode].lottoClassCode);

        }
      }
    });


  }

  getInstallment(classCode) {
    this.beanSer.doGet(`${URL.GET_ALL_INSTALLMENT}/${classCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.installList = data.data;

      }
    });

  }

  getDashboard(number, classCode) {
    this.categoryCode = number;
    this.data = null;
    this.getInstallment(classCode);
    // this.getFilterInstallment(classCode)
    this.paginateClassCode = classCode;
    this.loadList(classCode);
    this.beanSer.doGet(`${URL.GET_DASHBOARD}/${classCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        // console.log('getDashboard -> data', data);
        this.socket.postList.next(data.data);

      }
    });
  }

  goToView(event) {
    if (event.installment.includes('-')) {
      event.installment = moment(event.installment).format('DD/MM/YYYY')
    }
    if (this.categoryYeekee == LottoConstants.LOTTO_YEEKEE) {
      this.router.navigate(["lotto-settings/lotto-report-round"],
        { queryParams: { classCode: event.lottoClassCode, installment: event.installment, className: event.lottoClassName } });
    }
    else {
      this.router.navigate(["lotto-settings/lotto-report-detail"],
        { queryParams: { classCode: event.lottoClassCode, installment: event.installment, className: event.lottoClassName } });
    }


  }

  checkYeekee(categoryCode) {

    if (categoryCode == LottoConstants.LOTTO_YEEKEE) {

      this.categoryYeekee = LottoConstants.LOTTO_YEEKEE;
      this.isYekee = true;
      console.log("LOADING :::::::::::::::::::>", this.categoryYeekee);
    }
    else {

      this.categoryYeekee = categoryCode;
      this.isYekee = false;
      console.log("LOADING ~~~~~~~~~~~~~~~~~~~>", this.categoryYeekee);
    }
  }

  loadList(classCode) {
    // console.log("LOADING :::::::::::::::::::>"), this.paginateClassCode;
    this.paginateReq.sort = [{ column: "installment", order: "desc" }]
    this.setSearch();

    if (this.categoryYeekee == LottoConstants.LOTTO_YEEKEE) {
      // console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ  #### ", this.categoryYeekee);
      this.httpSer.doPost(`${URL.GET_PAGINATE_LOTTO_YEEKEE}?lottoClassCode=${this.paginateClassCode}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        if (res.status === 'SUCCESS') {
          this.dataPaginateList = res.data.data;
          this.dataLength = res.data.recordsTotal;
        }
      })
    }
    else {
      // console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   OTHER", this.categoryYeekee);
      this.httpSer.doPost(`${URL.GET_PAGINATE_LOTTO_OTHER}?lottoClassCode=${this.paginateClassCode}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        if (res.status === 'SUCCESS') {
          this.dataPaginateList = res.data.data;
          this.dataLength = res.data.recordsTotal;
        }
      })
    }

  }

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex;
    this.paginateReq.length = event.pageSize;
    this.loadList(null);
  }

  sortChange(event: SortChangeModel) {
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateReq.sort.push(sort)
    }
    this.loadList(null);
  }

  resetSearch() {
    this.searchModel.installment = '';
  }

  setSearch() {
    console.log(this.searchModel);
    // if(this.searchModel.installment != "Invalid date"){
    //   this.searchModel.installment = moment(this.searchModel.installment).format('DD/MM/YYYY');
    // }
    // else{
    //   this.searchModel.installment = '';
    // }


    this.paginateReq.filter = [];
    if (this.searchModel.installment) {
      this.paginateReq.filter.push({ column: 'tb.installment', op: '=', value: this.searchModel.installment.trim(), value1: '' });
    }
    // if (this.searchModel.realName) {
    //   this.paginateReq.filter.push({ column: 'tb.real_name', op: 'contain', value: this.searchModel.realName.trim(), value1: '' });
    // }
    // if (this.searchModel.remark) {
    //   this.paginateReq.filter.push({ column: 'tb.remark', op: 'contain', value: this.searchModel.remark.trim(), value1: '' });
    // }
    // if (this.searchModel.lastFailedLoginStart && this.searchModel.lastFailedLoginEnd) {
    //   this.paginateReq.filter.push({ column: 'tb.created_date', op: 'between', value: this.searchModel.lastFailedLoginStart, value1: this.searchModel.lastFailedLoginEnd });
    // }
    // if (this.searchModel.country) {
    //   this.paginateReq.filter.push({ column: 'tb.country', op: 'contain', value: this.searchModel.country.trim(), value1: '' });
    // }
    // if (this.searchModel.platform) {
    //   this.paginateReq.filter.push({ column: 'tb.platform', op: 'contain', value: this.searchModel.platform.trim(), value1: '' });
    // }
    // if (this.searchModel.browserName) {
    //   this.paginateReq.filter.push({ column: 'tb.browser_name', op: 'contain', value: this.searchModel.browserName.trim(), value1: '' });
    // }

  }
}
