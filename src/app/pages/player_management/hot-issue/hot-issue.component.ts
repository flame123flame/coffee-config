import { IssueTypeAddDialogComponent } from './issue-type-add-dialog/issue-type-add-dialog.component';
import { HotIssueDialogComponent } from './hot-issue-dialog/hot-issue-dialog.component';
import { MessageService } from 'src/app/service/message.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
const URL = {
  GET_ALL_LIST: 'hot-issue/get-hot-issue'
}
@Component({
  selector: 'app-hot-issue',
  templateUrl: './hot-issue.component.html',
  styleUrls: ['./hot-issue.component.scss']
})
export class HotIssueComponent implements OnInit {
  columns = [
    { header: '#', field: 'id' },
    {
      header: 'Username', field: 'username',
      // type: 'link',
      // onClick: (data) => {
      //   console.log(data);
      //   this.router.navigate(['player-management/player-list/player-profile'], {
      //     queryParams: {
      //       username: data.username
      //     }
      //   });
      // },
    },
    { header: 'Mobile Number', field: 'mobileNumber' },
    { header: 'User Remark', field: 'userRemark' },
    { header: 'Created Date', field: 'createdDate', type: 'textCenter'},
    { header: 'Updated By', field: 'updatedBy', type: 'textCenter'},
    { header: 'Updated Date', field: 'updatedDate', type: 'textCenter'},
    { header: 'Note', field: 'adminRemark' },
    { header: 'Status', field: 'status', type: 'textCenter'},
  ]

  dataInput = [];

  tr: any = [
    'id',
    'username',
    'mobileNumber',
    'userRemark',
    'createdDate',
    'updatedBy',
    'updatedDate',
    'adminRemark',
    'status',
    'action',
  ];
  actionSetting = new ActionSetting({
    hideDelete: false
  });
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: BaseService,
  ) { }

  ngOnInit(): void {
    this.getListHotIssue()
  }

  getListHotIssue() {
    this.httpService.doGet(URL.GET_ALL_LIST).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.map((data, idx) => {
          return {
            id: idx + 1,
            hotIssueCode: data.hotIssueCode,
            username: data.username,
            userRemark: data.userRemark,
            mobileNumber: data.mobileNumber,
            createdDate: moment(data.createdDate).format('DD/MM/YYYY HH:mm:ss') + ' น.',
            updatedBy: data.updatedBy,
            updatedDate: data.updatedDate != null ? moment(data.updatedDate).format('DD/MM/YYYY HH:mm:ss') + ' น.' : '',
            adminRemark: data.adminRemark,
            status: data.status,
          }
        })
      }
    })
  }
  updateStatus(data) {
    // console.log(data);
    const dialogRef = this.dialog.open(HotIssueDialogComponent, { data: data, width: '600px' });

    dialogRef.afterClosed().subscribe(result => {
      this.getListHotIssue();
    });
  }
  addIssueType() {
    const dialogRef = this.dialog.open(IssueTypeAddDialogComponent, { width: 'auto' });

    dialogRef.afterClosed().subscribe(result => {
      this.getListHotIssue();
    });
  }

}
