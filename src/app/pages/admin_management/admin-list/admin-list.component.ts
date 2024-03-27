import { PaginateFilter } from 'src/app/models/PaginateRequest';
import { ActionSetting } from './../../../models/ActionSettingModel';
import { MessageService } from './../../../service/message.service';
import { RequestPaginateRespond, RequestRespond } from './../../../models/RequestRespond';
import { PaginateRequest, PaginateSort } from './../../../models/PaginateRequest';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
const URL = {
  PAGINATE: "fw-user/paginate",
  MAIN: "fw-user",
  MAIN_ROLE: "fw-user-role"
}

interface paginateData {
  fwUsersId: number;
  username: string;
  realname?: string;
  fwUserRole?: string;
  fwUserRoleCode?: string;
  lastLoginIp?: string;
  createdBy?: string;
  updatedBy?: string;
  isDisable?: boolean;
  isActive?: boolean;
  lastLoginTime?: Date;
  createdDate?: Date;
  updatedDate?: Date;
  role?:any[];
  menu?:any[];
}

interface roleRes {
  id?: number;
  code?: string;
  name: string;
  isDisable?: boolean;
  fwUserRoleMenuAccessRes?: any;
  fwUserCount?: any;
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: string;
  updatedDate?: Date;
}


@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  columns = [
    {header : "Username" ,field :"username"},
    {header : "Role" ,field :"fwUserRole"},
    {header : "Last Login Time" ,field :"lastLoginTime"},
    {header : "Last Login Ip" ,field :"lastLoginIp"},
    {header : "Disable" ,field :"isDisable", type: 'textCenter'},
    {header : "OnlineStatus" ,field :"isActive", type: 'textCenter'}
  ];
  dataInput = [];

  tr: any = [
    "username",
    "fwUserRole",
    "lastLoginTime",
    "lastLoginIp",
    "isDisable",
    "isActive",
    'action',
  ];

  actionSetting: ActionSetting = new ActionSetting();

  searchUsername = null;
  searchStatus = null;
  searchRole = null;

  roleList : roleRes[] = [{id:-1,name:"All"}];

  constructor(private router: Router, private baseSer: BaseService) { }

  ngOnInit(): void {
    this.getRoleList();
    this.loadList();
  }

  toPageAddNewAdmin(id=null) {
    this.router.navigate(['/admin-management/new-admin'],{queryParams:{id:id}})
  }

  loadList() {
    this.baseSer.doPost(URL.PAGINATE, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
      if (res.status == MessageService.MSG.SUCCESS) {
        res.data.data.forEach((element,index) => {
          element.fwUserRole = ''
          element.fwUserRole = this.listObjectToString(element.role)
        });
        this.dataInput = res.data.data
        this.length = res.data.recordsTotal
      }
    })
  }

  listObjectToString(roleList:any[]){
    let str = [];
    roleList.forEach(element => {
      str.push(element.name);
    });
    return str.join(',')
  }

  filterParam(): PaginateRequest {
    let param: PaginateRequest = new PaginateRequest;
    return param
  }

  getRoleList(){
    this.baseSer.doGet(URL.MAIN_ROLE).subscribe((res:RequestRespond<roleRes[]>)=>{
      if (res.status == MessageService.MSG.SUCCESS) {
        this.roleList = [...this.roleList,...res.data]
      }
    })
  }

  deleteAction(id){
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.baseSer.doDelete(`${URL.MAIN}/${id}`).subscribe((res:RequestRespond<any>)=>{
        if (res.status == MessageService.MSG.SUCCESS) {
          this.loadList();
          DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.DIALOGMSGCONFIRM.DELETE_SUCCESS);
        }
      })
    });

  }

  editAction(id){
    console.log(id)
    this.toPageAddNewAdmin(id)
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

  filter(){
    // this.paginateReq.filter = []
    // if (this.searchStatus != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'tb.status'
    //   filter.op = '='
    //   filter.value = this.searchStatus?'1':'0';
    //   this.paginateReq.filter.push(filter)
    // }
    // if (this.searchRole != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'tb.'
    //   filter.op = event.direction
    //   filter.value = event.direction
    //   this.paginateReq.filter.push(filter)
    // }
    // if (this.searchUsername != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = event.active
    //   filter.op = event.direction
    //   filter.value = event.direction
    //   this.paginateReq.filter.push(filter)
    // }
    this.loadList();
  }

}
