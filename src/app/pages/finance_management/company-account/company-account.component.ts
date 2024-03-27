import {
  PaginateRequest,
  PaginateFilter,
} from './../../../models/PaginateRequest';
import { BaseService } from './../../../service/BaseService.service';
import { AddCompanyAccountDialogComponent } from './add-company-account-dialog/add-company-account-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';

const URL = {
  PAGINATE: 'company-account/paginate',
  DEFAULT: 'company-account',
  BANK: 'bank/get-bank-all',
};

class paginateData {
  id: number;
  bank: string;
  bankCode: string;
  displayName: string;
  accountName: string;
  group: string;
  depositDaily: string;
  withdrawDaily: string;
  balance: string;
  status: string;
  data: any;
}
@Component({
  selector: 'app-company-account',
  templateUrl: './company-account.component.html',
  styleUrls: ['./company-account.component.scss'],
})
export class CompanyAccountComponent implements OnInit {
  columns: any = [
    {
      header: '#',
      field: 'id',
    },
    {
      header: 'Bank Name',
      field: 'bank',
    },
    {
      header: 'Display Name',
      field: 'displayName',
    },
    {
      header: 'Account Name',
      field: 'accountName',
    },
    {
      header: 'group',
      field: 'group',
    },
    {
      header: 'Deposit Daily',
      field: 'depositDaily',
      type: 'textNumber',
    },
    {
      header: 'Withdraw Daily',
      field: 'withdrawDaily',
      type: 'textNumber',
    },
    {
      header: 'Balance',
      field: 'balance',
      type: 'textNumber',
    },
    {
      header: 'Status',
      field: 'status',
    },
  ];

  tr: any = [
    'id',
    'bank',
    'displayName',
    'accountName',
    'group',
    'depositDaily',
    'withdrawDaily',
    'balance',
    'status',
    'action',
  ];
  dataInput: any = [];
  groupBank = [];
  selected2 = 'All';
  constructor(private dialog: MatDialog, private httpSer: BaseService) {}

  openDialog(data = null): void {
    console.log(data);
    const dialogRef = this.dialog.open(AddCompanyAccountDialogComponent, {
      data: data,
      width: '95%',
      height: '95%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadList();
    });
  }
  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    let param: PaginateRequest = new PaginateRequest();
    param.page = 0;
    param.length = 10;
    if (this.selected2 != 'All') {
      let fil: PaginateFilter = new PaginateFilter();
      fil.column = 'bank';
      fil.op = 'contain';
      fil.value = this.selected2;
      param.filter = [fil];
    }
    this.httpSer.doPost(URL.PAGINATE, param).subscribe((res) => {
      console.table(res.data.data);
      if (res.status == 'SUCCESS') {
        let arr = [];
        res.data.data.forEach((element) => {
          let one: paginateData = new paginateData();
          one.data = element;
          one.id = element.id;
          one.bank = element.bank;
          one.bankCode = element.bankCode;
          one.displayName = element.displayName;
          one.accountName = element.accountName;
          one.group = element.group ? element.group.groupName : '';
          one.depositDaily = `${this.toCompactUnit(
            element.currDepositDaily
          )}/${this.toCompactUnit(element.maxDepositDaily)}`;
          one.withdrawDaily = `${this.toCompactUnit(
            element.currWithdrawDaily
          )}/${this.toCompactUnit(element.maxWithdrawDaily)}`;
          one.status = element.enable;
          one.balance = element.balance;

          arr.push(one);
        });
        res.data.data = arr;
        this.dataInput = res.data.data;
      }
    });
  }

  search() {
    this.loadList();
  }

  reset() {
    this.selected2 = 'All';
  }

  toCompactUnit(price) {
    if (price / 1000000000 >= 1) {
      price = `${price / 1000000000} B`;
    } else if (price / 1000000 >= 1) {
      price = `${price / 1000000} M`;
    } else if (price / 1000 >= 1) {
      price = `${price / 1000} K`;
    }
    return price;
  }

  doEdit(data) {
    this.openDialog(data.data);
  }
  doDelete(data) {
    this.httpSer.doDelete(`${URL.DEFAULT}/${data.id}`).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        this.loadList();
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
