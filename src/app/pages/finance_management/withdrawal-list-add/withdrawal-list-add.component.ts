import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
const URL = {
  GET_COMPANY: 'company-account',
  GET_CUSTOMMER: 'customer/get-customer-all',
  INSERT_WITHDRAW: 'withdraw/admin-request',
};

interface Company {
  id: number;
  bank: string;
  bankAccount: string;
  accountName: string;
  bankCode: string;
  maxDepositDaily: number;
  currDepositDaily: number;
  maxWithdrawDaily: number;
  currWithdrawDaily: number;
  groupCode: string;
  createdAt: string;
  updatedAt: string;
  balance: number;
  disable: boolean;
  displayName: string;
  maxDeposit: number;
  minDeposit: number;
  group?: any;
}

interface User {
  id: number;
  username: string;
  mobilePhone: string;
  realName: string;
  nickname?: any;
  email?: any;
  birthday?: any;
  bankCode: string;
  bankNameEn: string;
  bankNameTh: string;
  bankAccount: string;
  bankImg: string;
  groupCode: string;
  groupName: string;
  groupImg: string;
  tagCode?: any;
  tagName?: any;
  createdBy: string;
  createdDate: string;
  updatedBy?: any;
  updatedDate: string;
  enable: boolean;
  lastLoginDate: string;
  loginStatus: boolean;
  balance: number;
  bonus: number;
  pendingWithdrawal: number;
  affiliateCode: string;
  affiliateCodeUp?: any;
  registerDate: string;
  groupLevelRes?: any;
  totalDeposit: number;
  groupMobilePhone: string;
  groupLinkLine: string;
}

@Component({
  selector: 'app-withdrawal-list-add',
  templateUrl: './withdrawal-list-add.component.html',
  styleUrls: ['./withdrawal-list-add.component.scss'],
})
export class WithdrawalListAddComponent implements OnInit {
  form: FormGroup;
  // skipReviewCheck : boolean = false;
  bankList: Company[] = [];
  customerList: User[] = [];
  constructor(
    private baseSer: BaseService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCustommer();
    this.getCompanyList();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      username: [null, Validators.required],
      companyAccount: [null, Validators.required],
      amount: [null, Validators.required],
      adminRemark: [null],
    });
  }

  getCompanyList() {
    this.baseSer.doGet(URL.GET_COMPANY).subscribe((res) => {
      if (res.status == 'SUCCESS') {
        this.bankList = res.data;
      }
    });
  }

  getCustommer() {
    this.baseSer.doGet(URL.GET_CUSTOMMER).subscribe((res) => {
      if (res.status == 'SUCCESS') {
        this.customerList = res.data;
      }
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let body = this.form.value;
    body.bankAccount = this.form.controls.companyAccount.value['bankAccount'];
    body.accountName = this.form.controls.companyAccount.value['accountName'];
    body.bankName = this.form.controls.companyAccount.value['bankCode'];
    this.baseSer.doPost(URL.INSERT_WITHDRAW, body).subscribe((res) => {
      if (res.status == 'SUCCESS') {
        this.goBack();
      } else {
        if (res.message == 'OUT OF BALANCE') {
          this.form.controls.amount.setErrors({
            outOfBalance: this.form.controls.amount,
          });
        } else {
          alert(res.message);
        }
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/finance-management/withdrawal-list');
  }
}
