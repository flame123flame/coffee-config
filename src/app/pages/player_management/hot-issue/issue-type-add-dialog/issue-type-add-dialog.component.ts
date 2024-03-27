import { MessageService } from 'src/app/service/message.service';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { log } from 'console';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
const URL = {
  GET_ALL: 'issue-type/get-dropdown-issue-type',
  SAVE: 'issue-type/save-issue-type',
  EDIT: 'issue-type/edit-issue-type',
  GET_BY: 'issue-type/get-issue-type-by-code/',
  DELETE: 'issue-type/delete-issue-type/',
}
@Component({
  selector: 'app-issue-type-add-dialog',
  templateUrl: './issue-type-add-dialog.component.html',
  styleUrls: ['./issue-type-add-dialog.component.scss']
})
export class IssueTypeAddDialogComponent implements OnInit {
  columns = [
    { header: '#', field: 'id' },
    { header: 'Name', field: 'issueName' },
    { header: 'Description', field: 'description' },
    { header: 'Created By', field: 'createdBy', type: 'textCenter'},
    { header: 'Created Date', field: 'createdDate', type: 'textCenter' },
    { header: 'Updated By', field: 'updatedBy', type: 'textCenter'},
    { header: 'Updated Date', field: 'updatedDate', type: 'textCenter'},
    { header: 'Status', field: 'enable', type: 'textCenter'},
  ]
  dataInput = []
  tr = [
    'id',
    'issueName',
    'description',
    'createdBy',
    'createdDate',
    'updatedBy',
    'updatedDate',
    'enable',
    'action'
  ]
  actionSetting = new ActionSetting({});
  checkUpdate: boolean = true
  formAddIssueType: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<IssueTypeAddDialogComponent>,
    private httpService: BaseService,
    private fb: FormBuilder,
  ) {
    this.formAddIssueType = fb.group({
      typeCode: [null],
      issueName: [null, Validators.required],
      description: [null]
    })
  }

  ngOnInit(): void {
    this.getAll()
  }
  getAll() {
    this.httpService.doGet(URL.GET_ALL).subscribe(res => {
      if (MessageService.MSG.SUCCESS = res.status) {
        this.dataInput = res.data.map((data, idx) => {
          return {
            id: idx + 1,
            typeCode: data.typeCode,
            issueName: data.issueName,
            description: data.description,
            createdBy: data.createdBy,
            createdDate: moment(data.createdDate).format('DD/MM/YYYY HH:mm:ss'),
            updatedBy: data.updatedBy,
            updatedDate: data.updatedDate != null ? moment(data.updatedDate).format('DD/MM/YYYY HH:mm:ss') : '',
            enable: data.enable == true ? MessageService.MSG.ACTIVE : MessageService.MSG.INACTIVE
          }
        })
      }
    })
  }
  onAdd() {
    if (this.formAddIssueType.value.typeCode == null) {
      this.httpService.doPost(URL.SAVE, this.formAddIssueType.value).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          // this.onCancel()
          this.getAll()
        }
      })

    } else {
      this.httpService.doPut(URL.EDIT, this.formAddIssueType.value).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          // this.onCancel()
          this.getAll()
        }
      })
    }
  }
  onClear() {
    this.formAddIssueType.patchValue({
      typeCode: null,
      issueName: null,
      description: null
    })
    console.log(this.formAddIssueType.value);
    this.checkUpdate = true;
  }
  onCancel() { this.dialogRef.close(); }
  onEditIssueType(data) {
    this.checkUpdate = false
    console.log(data.typeCode);
    this.httpService.doGet(URL.GET_BY + data.typeCode).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formAddIssueType.patchValue({
          typeCode: res.data.typeCode,
          issueName: res.data.issueName,
          description: res.data.description
        })
      }
    })

  }
  onDeleteIssueType(data) {
    console.log(data);
    this.httpService.doDelete(URL.DELETE + data.typeCode).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.getAll()
      }
    })
  }

}
