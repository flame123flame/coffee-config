import { DatatableService } from './../../../service/DatatableService.service';
import { GameTagAddGameDialogComponent } from './game-tag-add-game-dialog/game-tag-add-game-dialog.component';
import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { GameTagModel } from './../../../models/respons-interface/GameTag';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameTagOrderEditDialogComponent } from './game-tag-order-edit-dialog/game-tag-order-edit-dialog.component';
import { GameTagEditDialogComponent } from './game-tag-edit-dialog/game-tag-edit-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
import { paginateData } from '../../admin_management/role-premission/role-premission.component';
import { ActionSetting } from 'src/app/models/ActionSettingModel';

const URL = {
  GET_PAGINATE: 'game-tag/paginate',
  GAME_TAG: 'game-tag'
}

@Component({
  selector: 'app-game-tag-setting',
  templateUrl: './game-tag-setting.component.html',
  styleUrls: ['./game-tag-setting.component.scss']
})
export class GameTagSettingComponent implements OnInit {
  columns: any = [
    {
      header: 'Tag Name',
      field: 'code',
    },
    {
      header: 'Display Name TH',
      field: 'nameTh'
    },
    {
      header: 'Display Name EN',
      field: 'nameEn'
    },
    {
      header: 'Updated By',
      field: 'updatedBy',
      type: 'textCenter'
    },
    {
      header: 'Updated On',
      field: 'updatedAt',
      type: 'textCenter'
    }
  ];

  tr: any = [
    'no',
    'code',
    'nameTh',
    'nameEn',
    'updatedBy',
    'updatedAt',
    'status-slide-toggle',
    'action',
  ];

  tr1: any = ['tagName', 'feDisplayName', 'action'];
  dataSource: GameTagModel[] = [];
  actionSetting: ActionSetting = new ActionSetting({
    listIcon: [
      {
        color: 'black',
        icon: 'post_add',
        action: (row) => {
          this.openAddGameDialog(row)
        },
        type: 'icon'
      }
    ]
  });
  form: FormGroup;

  constructor(public dialog: MatDialog,
    private router: Router,
    private baseSer: BaseService,
    private fb: FormBuilder) {
    let sort1: PaginateSort = new PaginateSort();
    sort1.column = 'priority'
    sort1.order = 'desc'
    this.paginateReq.sort.push(sort1)
    let sort2: PaginateSort = new PaginateSort();
    sort2.column = 'created_at'
    sort2.order = 'desc'
    this.paginateReq.sort.push(sort2)
    this.loadList();
    this.createForm();
  }

  ngOnInit(): void { }

  openReorderDialog() {
    const dialogRef = this.dialog.open(GameTagOrderEditDialogComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe(res => {
      this.loadList();
    })
  }

  createForm() {
    this.form = this.fb.group({
      code: [null, Validators.required],
      nameTh: [null, Validators.required],
      nameEn: [null],
    })
  }

  openEditDialog(data) {
    const dialogRef = this.dialog.open(GameTagEditDialogComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.loadList();
    })
  }

  openAddGameDialog(data) {
    this.dialog.open(GameTagAddGameDialogComponent, {
      data: data,width: '90%'
    });
  }


  loadList() {
    this.baseSer.doPost(URL.GET_PAGINATE, this.paginateReq).subscribe((res: RequestPaginateRespond<any>) => {
      if (res.status == MessageService.MSG.SUCCESS) {
        res.data.data.forEach(element => {
          element.toggle = {};
          element.toggle.status = element.isActive;
          element.updatedAt = element.updatedAt?moment(element.updatedAt).format('DD/MM/YYYY'):null;
        });
        res.data.data = DatatableService.setEmptyData(res.data.data);
        this.dataSource = res.data.data
        console.log(this.dataSource);

        this.length = res.data.recordsTotal
      }
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

  filter() {
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

  addNewGameTag() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    let form = this.form.value;
    form.isActive = true;
    form.priority = 0;
    form.userView = '8VIEW';

    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.baseSer.doPost(URL.GAME_TAG, form).subscribe(res => {
        if (res.status == MessageService.MSG.SUCCESS) {
          this.loadList();
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    });

  }

  delete(event) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.baseSer.doDelete(`${URL.GAME_TAG}/${event.id}`).subscribe(res => {
        if (res.status == MessageService.MSG.SUCCESS) {
          this.loadList();
          DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.DIALOGMSGCONFIRM.DELETE_SUCCESS);
        }
      })
    });
  }

  toggleStatus(event) {
    console.log(event);
    let data = event.data;
    data.isActive = event.status.checked
    this.baseSer.doPut(`${URL.GAME_TAG}/${data.id}`, data).subscribe(res => {
      if (res.status == MessageService.MSG.SUCCESS) {
        this.loadList();
        DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    })
  }
}
