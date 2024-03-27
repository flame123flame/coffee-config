import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
export interface DialogData {
  depositOrder: string;
}
@Component({
  selector: 'app-deposit-request-detail',
  templateUrl: './deposit-request-detail.component.html',
  styleUrls: ['./deposit-request-detail.component.scss'],
})
export class DepositRequestDetailComponent implements OnInit {
  perInfo = [
    {
      title: 'Deposit ID',
      value: '',
    },
    {
      title: 'Player Created On',
      value: '',
    },
    {
      title: 'Player ID',
      value: '',
    },
    {
      title: 'First Deposit',
      value: '',
    },
    {
      title: 'Real Name',
      value: '',
    },
    {
      title: 'Auditor',
      value: '',
    },
    {
      title: 'VIP Level',
      value: '',
    },
    {
      title: 'Audit Date',
      value: '',
    },
  ];

  columns: any = [
    {
      header: 'Wallet/Balance',
      field: 'wallet',
    },
    {
      header: 'Cash Balance',
      field: 'cashBalance',
    },
    {
      header: 'Bonus',
      field: 'bonus',
    },
    {
      header: 'Pending Withdrawal',
      field: 'pendingWithdrawal',
    },
    {
      header: 'Available Balance',
      field: 'availableBalance',
    },
  ];

  displayedColumns: any = [
    'wallet',
    'cashBalance',
    'bonus',
    'pendingWithdrawal',
    'availableBalance',
  ];
  dataTable: any = [];
  depositDetail = [
    { title: 'Payment Type', value: '' },
    { title: 'Bank Name', value: '' },
    { title: 'Deposit Type', value: '' },
    { title: 'Player Deposit Time', value: '' },
    { title: 'Deposit Amt.', value: '' },
    { title: 'Requested On', value: '' },
    { title: 'Request From##', value: '' },
    { title: 'Deposit IP', value: '' },
    { title: 'Deposit Name', value: '' },
    { title: 'Status', value: '' },
  ];
  collectionAccount = [
    { title: 'Bank Name', value: '' },
    { title: 'Bank Account', value: '' },
    { title: 'Bank Branch', value: '' },
    { title: 'Account Name', value: '' },
  ];
  constructor(
    public dialogRef: MatDialogRef<DepositRequestDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private baseService: BaseService
  ) {
    this.fatchDepositList(data.depositOrder);
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  fatchDepositList(data) {
    this.baseService
      .doGet(`deposit/get-detail/${data}`)
      .subscribe(({ data }) => {
        if (data) {
          this.perInfo = [
            {
              title: 'Deposit ID',
              value: data.depositOrder,
            },
            {
              title: 'Player Created On',
              value: data.customerRes.registerDate,
            },
            {
              title: 'Player ID',
              value: data.customerRes.username,
            },
            {
              title: 'First Deposit',
              value: '',
            },
            {
              title: 'Real Name',
              value: data.customerRes.realName,
            },
            {
              title: 'Auditor',
              value: data.auditor,
            },
            {
              title: 'VIP Level',
              value: data.customerRes.group,
            },
            {
              title: 'Audit Date',
              value: data.customerRes.auditorDate,
            },
          ];
          this.depositDetail = [
            { title: 'Payment Type', value: '' },
            { title: 'Bank Name', value: 'bankCode' },
            { title: 'Deposit Type', value: data.customerRes.depositType },
            { title: 'Player Deposit Time', value: '' },
            { title: 'Deposit Amt.', value: data.customerRes.amount },
            { title: 'Requested On', value: data.customerRes.createdDate },
            { title: 'Request From##', value: '' },
            { title: 'Deposit IP', value: '' },
            { title: 'Deposit Name', value: data.customerRes.bankAccount },
            { title: 'Status', value: data.customerRes.status },
          ];
          this.collectionAccount = [
            { title: 'Bank Name', value: data.companyAccountName },
            { title: 'Bank Account', value: data.companyBankAccount },
            { title: 'Bank Branch', value: '' },
            { title: 'Account Name', value: data.companyBankCode },
          ];
        }

        this.baseService
          .doGet(`wallet/get-balance/${data.username}`)
          .subscribe(({ data }) => {
            this.dataTable = [
              {
                wallet: 'MAIN',
                cashBalance: data,
                bonus: '',
                pendingWithdrawal: '',
                availableBalance: '',
              },
            ];
          });
      });
  }
}
