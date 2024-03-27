import { BaseService } from './../../../../service/BaseService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { group } from '@angular/animations';

const URL = {
  PAGINATE: 'company-account/paginate',
  DEFAULT: 'company-account',
  GROUP: 'groupLevel/getAllGroupLevel',
  BANK: 'bank/get-bank-all',
};
@Component({
  selector: 'app-add-company-account-dialog',
  templateUrl: './add-company-account-dialog.component.html',
  styleUrls: ['./add-company-account-dialog.component.scss'],
})
export class AddCompanyAccountDialogComponent implements OnInit {
  paymentTypeList: string[] = ['1', '2'];
  currencyList: string[] = ['1', '2'];
  bankNameList: string[] = ['1', '2'];
  groupList = [];
  groupBank = [];
  accountType: number = 1;
  myForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddCompanyAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private httpSer: BaseService
  ) {
    this.createFrom();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createFrom() {
    if (this.data) {
      this.myForm = this.fb.group({
        bank: [this.data['bank'], Validators.required],
        bankId: [this.data['bankId'], Validators.required],
        bankCode: [this.data['bankCode'], Validators.required],
        bankAccount: [this.data['bankAccount'], Validators.required],
        accountName: [this.data['accountName'], Validators.required],
        groupCode: [this.data['groupCode'], Validators.required],
        maxDepositDaily: [this.data['maxDepositDaily'], Validators.required],
        maxWithdrawDaily: [this.data['maxWithdrawDaily'], Validators.required],
        displayName: [this.data['displayName'], Validators.required],
      });
    } else {
      this.myForm = this.fb.group({
        bank: [null, Validators.required],
        bankId: [null, Validators.required],
        bankCode: [null, Validators.required],
        bankAccount: [null, Validators.required],
        accountName: [null, Validators.required],
        groupCode: [null, Validators.required],
        maxDepositDaily: [null, Validators.required],
        maxWithdrawDaily: [null, Validators.required],
        displayName: [null, Validators.required],
      });
    }
  }

  ngOnInit() {
    this.getGroup();
    this.getBank();
  }

  save() {
    let param = this.myForm.value;
    console.log(param);

    if (this.data) {
      param['id'] = this.data['id'];
      this.httpSer.doPut(URL.DEFAULT, param).subscribe((data) => {
        if (data.status == 'SUCCESS') {
          this.onNoClick();
          DialogSweetAlertService.opentModalSweetAlertSuccess('', data.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', data.message);
        }
      });
      return;
    }
    this.httpSer.doPost(URL.DEFAULT, param).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        this.onNoClick();
        DialogSweetAlertService.opentModalSweetAlertSuccess('', data.message);
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', data.message);
      }
    });
  }

  getGroup() {
    this.httpSer.doGet(URL.GROUP).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        this.groupList = data.data;
      }
    });
  }

  getBank() {
    this.httpSer.doGet(URL.BANK).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        this.groupBank = data.data;
      }
    });
  }
}
