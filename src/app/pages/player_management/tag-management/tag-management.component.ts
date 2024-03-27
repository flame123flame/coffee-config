import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PaginateRequest, PaginateFilter } from './../../../models/PaginateRequest';
import { BaseService } from './../../../service/BaseService.service';
import { NewTagDialogComponent } from './new-tag-dialog/new-tag-dialog.component';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import * as moment from 'moment';

const URL = {
  DEFAULT: 'tag-management',
  PAGINATE: 'tag-management/paginate',
}
@Component({
  selector: 'app-tag-management',
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit {
  columns = [
    {
      header: 'Tag Name',
      field: 'name',
    },
    {
      header: 'Description',
      field: 'description',
    },
    {
      header: 'total Players',
      field: 'totalPlayers',
      type: 'textNumber'
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
    },
    {
      header: 'Remark',
      field: 'remark',
    },
  ];

  dataInput = [];

  tr: any = [
    'name',
    'description',
    'totalPlayers',
    'updatedBy',
    'updatedAt',
    'remark',
    'action'
  ];
  actionSetting = new ActionSetting({
    hideEdit: true,
    hideDelete: true
  });
  keyBoardOptions: any[] = [{ name: 'Tag Name', value: 'name' }, { name: 'Update By', value: 'update_by' }];

  formFilter: FormGroup;

  constructor(public dialog: MatDialog,
    private tagSer: BaseService,
    private fb: FormBuilder) {
    this.createFrom();
  }

  ngOnInit(): void {
    this.loadList()
  }

  createFrom() {
    this.formFilter = this.fb.group({
      selectCol: [null],
      keyword: [null],
      startDate: [null],
      endDate: [null]
    })
  }

  loadList() {
    let data: PaginateRequest = new PaginateRequest();
    let wordFilter: PaginateFilter = new PaginateFilter();
    data.filter = []
    if (this.formFilter.controls.selectCol.value && this.formFilter.controls.keyword.value) {
      wordFilter.column = this.formFilter.controls.selectCol.value
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.keyword.value
      data.filter.push(wordFilter)
    }
    let dateFilter: PaginateFilter = new PaginateFilter();
    if (this.formFilter.controls.startDate.value) {
      dateFilter.column = 'updated_at'
      dateFilter.op = '>='
      dateFilter.value = this.formFilter.controls.startDate.value
      data.filter.push(dateFilter)
    }
    let dateFilterEnd: PaginateFilter = new PaginateFilter();

    if (this.formFilter.controls.endDate.value) {
      dateFilterEnd.column = 'updated_at'
      dateFilterEnd.op = '<='
      dateFilterEnd.value = this.formFilter.controls.endDate.value
      data.filter.push(dateFilterEnd)
    }
    data.length = 10
    data.page = 0
    data.sort = []

    this.tagSer.doPost(URL.PAGINATE, data).subscribe(data => {
      if (data.status === 'SUCCESS') {
        console.log(data);

        this.dataInput = data.data.data
        this.dataInput.forEach(val => {
          val.updatedAt = moment(val.updatedAt).format('DD/MM/YYYY HH:mm:ss');
        });
        console.log(this.dataInput);
      } else {
        console.log(data.data);

      }
    })
  }

  openDialog(data = null): void {
    const dialogRef = this.dialog.open(NewTagDialogComponent, { data: data, width: '600px' });

    dialogRef.afterClosed().subscribe(result => {
      this.loadList();
    });
  }

  deleteOne(data) {
    this.tagSer.doDelete(URL.DEFAULT + `/${data.id}`).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.loadList();
      }
    })
  }
  editData(data) {
    this.openDialog(data)

  }

  search() {
    this.loadList();
  }

  reset() {
    this.createFrom();
  }


}
