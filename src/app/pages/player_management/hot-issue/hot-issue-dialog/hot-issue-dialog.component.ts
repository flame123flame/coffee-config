import { MessageService } from 'src/app/service/message.service';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
import { Inject } from '@angular/core';
const URL = {
  SAVE: 'hot-issue/update-hot-issue',
}
export interface DialogData {
  data: string;
}
@Component({
  selector: 'app-hot-issue-dialog',
  templateUrl: './hot-issue-dialog.component.html',
  styleUrls: ['./hot-issue-dialog.component.scss']
})
export class HotIssueDialogComponent implements OnInit {
  formUpdateIssue: FormGroup
  constructor(
    public dialogRef: MatDialogRef<HotIssueDialogComponent>,
    private fb: FormBuilder,
    private httpService: BaseService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    this.formUpdateIssue = fb.group({
      hotIssueCode: [null],
      adminRemark: [null,],
      status: [MessageService.MSG.APPROVE, Validators.required]
    })
  }

  ngOnInit(): void {
    console.log(this.data);
    this.createForm(this.data);
  }
  createForm(data) {
    if (data.status == MessageService.MSG.PENDING) {
      this.formUpdateIssue.patchValue({
        hotIssueCode: data.hotIssueCode,
      })
    } else {
      this.formUpdateIssue.patchValue({
        hotIssueCode: data.hotIssueCode,
        adminRemark: data.adminRemark,
        status: data.status
      })
    }
  }
  onCancel() {
    this.dialogRef.close();
  }

  onUpdate() {
    console.log(this.formUpdateIssue.value);
    this.httpService.doPut(URL.SAVE, this.formUpdateIssue.value).subscribe(res => {
      if (MessageService.MSG.SUCCESS = res.status) {
        alert(res.status)
        this.onCancel();
      }
    })
  }
}
