import { BeanService } from './../../../service/BeanService.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSetting, EditIcon } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
const URL = {
  MAIN: "lotto-group-number",
  GET_PAGINATE: "lotto-group-number"
}

interface table {
  id: number
  createdDate: string
  updatedDate: string
  updatedBy: string
  createdBy: string
  name: string
  lottoNumberGroupCode: string
  usernameOwner: string
  lottoGroupNumberChildList: string
  lottoGroupNumberChildCount: number
}

@Component({
  selector: 'app-lotto-group',
  templateUrl: './lotto-group.component.html',
  styleUrls: ['./lotto-group.component.scss']
})
export class LottoGroupComponent implements OnInit {
  actionSetting: ActionSetting = new ActionSetting({})

  constructor(
    private httpSer: BaseService,
    private beanSer: BeanService,
    private router: Router
  ) {
  }

  data: table[] = [];


  columns: any = [
    { header: 'Name', field: 'name' },
    { header: 'Number Amount', field: 'lottoGroupNumberChildCount', type: 'textNumber'},
    { header: 'Owner', field: 'usernameOwner' },

  ];

  tr: any = [
    'name',
    'lottoGroupNumberChildCount',
    'usernameOwner',
    'action'
  ];

  ngOnInit(): void {
    this.getPaginate()
  }

  goToAddEdit(data = null) {
    this.router.navigate(["lotto-settings/lotto-group/add-edit"],
      { queryParams: { id: data ? data.id : null } });
  }

  deleteId(data) {
    console.log(data)
    this.httpSer.doDelete(`${URL.MAIN}/${data.id}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        console.log("success");
        this.getPaginate();
      }
    })
  }


  length: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest();

  getPaginate() {
    this.data = []
    this.httpSer.doGet(URL.GET_PAGINATE).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.data = data.data
        // this.length = data.data.recordsTotal
      }
    })
  }

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex
    this.paginateReq.length = event.pageSize
    this.getPaginate();
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.paginateReq.sort.push(sort)
    }
    this.getPaginate();
  }

}
