import { DialogSweetAlertService } from './../../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../../service/message.service';
import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { take, takeUntil } from 'rxjs/operators';
import { BaseService } from 'src/app/service/BaseService.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder } from '@angular/forms';
const URL = {
  GET_ALL_GROUP: "groupLevel/get-dropdown-group",
  GET_ALL_USERNAME: "customer/get-dropdown-customer",
  GET_ALL_PROMO: "promotion/get-all",
  SAVE: "inbox-message/save-send-message",
}
export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-send-message-dialog',
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['./send-message-dialog.component.scss']
})
export class SendMessageDialogComponent implements OnInit {
  usernames = []
  groupList = []
  messageTypes = [
    { messageType: 'NORMAL' },
    { messageType: 'POMOTION' }]
  promotions = []
  formSendMessage: FormGroup
  constructor(
    public dialogRef: MatDialogRef<SendMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private httpService: BaseService,
    private formBuilder: FormBuilder,
  ) {
    this.formSendMessage = this.formBuilder.group({
      usernames: new FormControl({ value: null, disabled: false }),
      groupCodes: new FormControl({ value: null, disabled: false }),
      subject: new FormControl({ value: null, disabled: false }),
      messageType: new FormControl({ value: 'NORMAL', disabled: false }),
      promoCode: new FormControl({ value: null, disabled: false }),
      webMessage: new FormControl({ value: null, disabled: false }),
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getDropdownCustomer()
    this.getDropdownGroup()
    this.getDropdownPromo()
  }

  getDropdownCustomer() {
    this.httpService.doGet(URL.GET_ALL_USERNAME).subscribe(res => {
      if (MessageService.MSG.SUCCESS = res.status) {
        this.usernames = res.data.map(data => {
          return {
            username: data.username,
          }
        })
      }
    })
  }
  getDropdownGroup() {
    this.httpService.doGet(URL.GET_ALL_GROUP).subscribe(res => {
      if (MessageService.MSG.SUCCESS = res.status) {
        this.groupList = res.data.map(data => {
          return {
            groupCode: data.groupCode,
            groupName: data.groupName,
          }
        })
      }
    })
  }
  getDropdownPromo() {
    this.httpService.doGet(URL.GET_ALL_PROMO).subscribe(res => {
      if (MessageService.MSG.SUCCESS = res.status) {
        this.promotions = res.data.map(data => {
          return {
            promoCode: data.promoCode,
            promoTitle: data.promoTitle,
          }
        })
      }
    })
  }

  sendMessage() {
    if (this.formSendMessage.value.messageType == 'NORMAL') {
      this.formSendMessage.patchValue({ promoCode: '' })
    }
    console.log(this.formSendMessage.value);
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.httpService.doPost(URL.SAVE, this.formSendMessage.value).subscribe(res => {
        if (MessageService.MSG.SUCCESS = res.status) {
          this.formSendMessage.patchValue({
            usernames: null,
            groupCodes: null,
            subject: null,
            messageType: null,
            promoCode: null,
            webMessage: null,
          })
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.dialogRef.close();
        }
        else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    });

  }
  changeData(data) {
    console.log(data);
  }




  onChange($event) {
    this.formSendMessage.get('webMessage').patchValue($event);
  }
  config: AngularEditorConfig = {
    height: '200px',
  };

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

  toggleSelectAll(selectAllValue: boolean) {

  }

  protected setInitialValue() {

  }

  protected filterBanksMulti() {

  }
}
