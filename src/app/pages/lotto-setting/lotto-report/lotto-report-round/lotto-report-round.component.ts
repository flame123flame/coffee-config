import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting, EditIcon } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { paginateData } from 'src/app/pages/player_management/failed-login/failed-login.component';
import { BeanService } from 'src/app/service/BeanService.service';


const URL = {

  GET_PAGINATE: "lotto-report/paginate-report-round",
  GET_ROUND_ON_SUBMIT: 'lotto-transaction/get-yeekee-round-by-installment',
};

@Component({
  selector: 'app-lotto-report-round',
  templateUrl: './lotto-report-round.component.html',
  styleUrls: ['./lotto-report-round.component.scss']
})
export class LottoReportRoundComponent implements OnInit {
  actionSetting: ActionSetting = new ActionSetting({})

  installment: any = '';
  classCode: any = '';
  className: any = '';
  dataPaginateList = [];
  dataLength = 0;
  paginateReq: PaginateRequest = new PaginateRequest();
  
  columns: any = [
    { header: 'Installment', field: 'installment' },
    { header: 'Round', field: 'roundYeekee' },
    { header: 'ClassCode', field: 'classCode' },


  ];

  tr: any = [
    // 'installment',
    'roundYeekee',
    'action'
  ];

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private beanSer: BeanService,
    private httpBeanService: BeanService,
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
   }

  ngOnInit(): void {
    const data = this.activateRoute.snapshot.queryParams;
    this.installment = data.installment;
    this.classCode = data.classCode;
    this.className = data.className;
    this.loadList(null);
  }

  goToView(event) {
    console.log(event);
    this.router.navigate(["lotto-settings/lotto-report-detail"],
      { queryParams: {categoryCode: event.lottoCategoryCode, classCode: event.lottoClassCode, installment: event.installment, className: this.className, roundYeekee: event.roundYeekee} });
  }

  goBack() {
    this.router.navigate(["lotto-settings/lotto-report"]);
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

  loadList(data) {
    this.paginateReq.sort = [{ column: "round_yeekee", order: "asc" }]
    this.setSearch();
    this.beanSer.doPost(`${URL.GET_PAGINATE}?lottoClassCode=${this.classCode}&installment=${this.installment}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
      if (res.status === 'SUCCESS') {
        this.dataPaginateList = res.data.data;
        this.dataLength = res.data.recordsTotal
        console.log("PAGINATE : ", this.dataPaginateList);
      }
    })
  }
  setSearch() {
  }

}
