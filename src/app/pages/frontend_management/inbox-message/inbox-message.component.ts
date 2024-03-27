import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { MatDialog } from '@angular/material/dialog';
import { SendMessageDialogComponent } from './send-message-dialog/send-message-dialog.component';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import * as moment from 'moment';
import { FilterOp, PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
const URL = {
  GET_ALL: "inbox-message/get-send-message",
  DELETE: "inbox-message/delete-send-message/",
}
@Component({
  selector: 'app-inbox-message',
  templateUrl: './inbox-message.component.html',
  styleUrls: ['./inbox-message.component.scss'],
})
export class InboxMessageComponent implements OnInit {
  columns = [
    {
      header: 'Subject',
      field: 'subject',
    },
    {
      header: 'Sender',
      field: 'sender',
    },
    {
      header: 'Date',
      field: 'date',
      type: 'textCenter'
    }
  ];

  dataInput = [];
  tr: any = ['subject', 'sender', 'date', 'action'];
  actionSetting = new ActionSetting({
    hideEdit: false,
    hideDetail: true,
    hideDelete: true,

  });
  dataLength: number = 0;
  dataPG: PaginateRequest = new PaginateRequest();
  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 90,
    0,
    0,
    0
  )
  maxDate = new Date(new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59)
  form: FormGroup;
  constructor(
    private dialog: MatDialog,
    private httpService: BaseService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      sender: [null],
      subject: [null],
      message: [null],
    })
  }

  ngOnInit(): void {
    this.getMessageAll();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SendMessageDialogComponent, { width: '800px' });

    dialogRef.afterClosed().subscribe(result => {
      this.getMessageAll();
    });
  }

  getMessageAll() {
    this.dataPG.filter = []
    let wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = 'm.message_type';
    wordFilter.op = '<>';
    wordFilter.value = 'AUTO';
    this.dataPG.filter.push(wordFilter);

    if (this.form.controls.startDate.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'm.created_date';
      wordFilter.op = FilterOp.MORE_EQUAL;
      wordFilter.value = moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
      this.dataPG.filter.push(wordFilter);
    }
    if (this.form.controls.endDate.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'm.created_date';
      wordFilter.op = FilterOp.LESS_EQUAL;
      wordFilter.value = moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
      this.dataPG.filter.push(wordFilter);
    }
    if (this.form.controls.sender.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'm.created_by';
      wordFilter.op = FilterOp.CONTAIN;
      wordFilter.value = this.form.controls.sender.value;
      this.dataPG.filter.push(wordFilter);
    }
    if (this.form.controls.subject.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'm.subject';
      wordFilter.op = FilterOp.CONTAIN;
      wordFilter.value = this.form.controls.subject.value;
      this.dataPG.filter.push(wordFilter);
    }
    if (this.form.controls.message.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'm.web_message';
      wordFilter.op = FilterOp.CONTAIN;
      wordFilter.value = this.form.controls.message.value;
      this.dataPG.filter.push(wordFilter);
    }

    this.httpService.doPost(URL.GET_ALL, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.data.map(data => {
          return {
            messageCode: data.messageCode,
            subject: data.subject,
            sender: data.createdBy,
            date: moment(data.createdDate).format('DD/MM/YYYY HH:mm:ss'),
          }
        })
        this.dataLength = res.data.recordsTotal
      } else {
      }


    })
  }
  onDelete(event) {
    console.log(event);
    let code = event.messageCode;
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.httpService.doDelete(URL.DELETE + code).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.getMessageAll()
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    });
  }

  pageChange(event: PageChangeModel) {
    this.dataPG.page = event.pageIndex
    this.dataPG.length = event.pageSize
    this.getMessageAll();
  }

  sortChange(event: SortChangeModel) {
    this.dataPG.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.dataPG.sort.push(sort)
    }
    this.getMessageAll();
  }

  resetData() {
    this.form.controls.startDate.setValue(null)
    this.form.controls.endDate.setValue(null)
    this.form.controls.sender.setValue(null)
    this.form.controls.subject.setValue(null)
    this.form.controls.message.setValue(null)
    this.getMessageAll()
  }
}
