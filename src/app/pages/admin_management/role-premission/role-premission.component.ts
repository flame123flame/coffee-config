import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RolePremissionAddComponent } from './dialog/role-premission-add/role-premission-add.component';
import menu from 'src/app/config/menu';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { RequestPaginateRespond, RequestRespond } from 'src/app/models/RequestRespond';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import * as moment from 'moment';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
const URL = {
  PAGINATE: "fw-user-role/paginate",
  MAIN: "fw-user",
  MAIN_ROLE: "fw-user-role"
}

export interface paginateData {
  id: number;
  code: string;
  name: string;
  isDisable: boolean;
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
  fwUserRoleMenuAccessRes?: any;
  fwUserCount: number;
}


@Component({
  selector: 'app-role-premission',
  templateUrl: './role-premission.component.html',
  styleUrls: ['./role-premission.component.scss']
})
export class RolePremissionComponent implements OnInit {
  columns = [
    { header: 'Name', field: 'name' },
    { header: 'Count', field: 'fwUserCount', type: 'textNumber'},
    { header: 'Created Date', field: 'createdDate', type: 'textCenter'},
    { header: 'Created By', field: 'createdBy', type: 'textCenter'},
    { header: 'Updated Date', field: 'updatedDate', type: 'textCenter'},
    { header: 'Updated By', field: 'updatedBy', type: 'textCenter'},
    { header: 'Status', field: 'isDisable', type: 'textCenter'},
  ];
  dataInput = [];

  tr: any = [
    'name',
    'fwUserCount',
    'createdDate',
    'createdBy',
    'updatedDate',
    'updatedBy',
    'isDisable',
    'action',
  ];

  constructor(private router: Router, public dialog: MatDialog, private baseSer: BaseService) { }

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.baseSer.doPost(URL.PAGINATE,  this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
      if (res.status == MessageService.MSG.SUCCESS) {
        this.dataInput = res.data.data
        this.dataInput.forEach(val => {
          val.createdDate = moment(val.createdDate).format('DD/MM/YYYY HH:mm:ss');
          val.updatedDate = moment(val.updatedDate).format('DD/MM/YYYY HH:mm:ss');
        });
        this.length = res.data.recordsTotal

      }
    })
  }

  deleteAction(id){
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.baseSer.doDelete(`${URL.MAIN_ROLE}/${id}`).subscribe((res:RequestRespond<any>)=>{
        if (res.status == MessageService.MSG.SUCCESS) {
          this.loadList();
          DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.DIALOGMSGCONFIRM.DELETE_SUCCESS);

        }else{
          alert(res.message);
        }
      })
    });

  }

  editAction(id){
    this.openDialog(id)
  }

  openDialog(id = null){
    if (id) {
      let ref = this.dialog.open(RolePremissionAddComponent , {data:id , width:'600px'})
      ref.afterClosed().subscribe(data=>{
        this.loadList()
      })
      return
    }
    let ref = this.dialog.open(RolePremissionAddComponent , {width:'600px'})
    ref.afterClosed().subscribe(data=>{
      this.loadList()
    })
  }

  length: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest();

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex
    this.paginateReq.length = event.pageSize
    this.loadList();
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.paginateReq.sort.push(sort)
    }
    this.loadList();
  }



}
