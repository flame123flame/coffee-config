import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { Component, OnInit } from '@angular/core';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DepositRequestDetailComponent } from './fragement/deposit-request-detail/deposit-request-detail.component';
import { BaseService } from 'src/app/service/BaseService.service';
import {
  PaginateFilter,
  PaginateRequest,
  PaginateSort,
} from 'src/app/models/PaginateRequest';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  PageChangeModel,
  SortChangeModel,
} from 'src/app/models/MatTableChange';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
const URL = {
  GET_DEPOSIT: 'deposit/get-deposit-list-paginate',
  FIND_USERNAME: 'customer/get-user/',
};
@Component({
  selector: 'app-deposit-list',
  templateUrl: './deposit-list.component.html',
  styleUrls: ['./deposit-list.component.scss'],
})
export class DepositListComponent implements OnInit {
  sumDeposit = 0;
  totalDeposit = 0;
  dateTypeOptions: string[] = ['Deposit Date', 'Audit Date'];
  dateType = this.dateTypeOptions[0];
  statusTypeOptions: String[] = ['APPROVE', 'PENDING', 'REJECT'];
  statusType = 'ALL';
  maxDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59
  );
  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 90,
    0,
    0
  );
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1,
    0,
    0,
    0
  );
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add',
      onClick: () => {
        this.router.navigate([
          'finance-management/deposit-list/deposit-list-add',
        ]);
      },
    },
  ];
  columns: any = [
    {
      header: 'Deposit ID',
      field: 'd.deposit_order',
      type: 'link',
      onClick: (data) => {
        this.openDialog(data);
      },
      footer: 'Subtotal',
      fieldSecondFooter: 'dpi',
    },
    {
      header: 'Deposit Date',
      field: 'd.created_date',
      fieldSecondFooter: 'crd',
    },
    {
      header: 'Player ID',
      field: 'd.username',
      fieldSecondFooter: 'pyi',
    },
    {
      header: 'Payment Info',
      field: 'c.real_name',
      fieldSecondFooter: 'pif',
    },
    {
      header: 'Deposit',
      field: 'd.amount',
      type: 'pipeNumber',
      footer: this.sumDeposit,
      fieldSecondFooter: 'totalDepositFooter',
      footerSecondValue: this.totalDeposit,
    },
    {
      header: 'Before Balance',
      field: 'd.beforeBalance',
      fieldSecondFooter: 'bfb',
    },
    {
      header: 'After Balance',
      field: 'd.afterBalance',
      fieldSecondFooter: 'afb',
    },
    {
      header: 'Company Bank Name',
      field: 'ca.bank',
      fieldSecondFooter: 'cbn',
    },
    {
      header: 'Company Account Number',
      field: 'ca.bank_account',
      fieldSecondFooter: 'can',
    },
    {
      header: 'Company Name',
      field: 'ca.account_name',
      fieldSecondFooter: 'cpn',
    },
    {
      header: 'Status',
      field: 'd.status',
      type: 'textCenter',
      fieldSecondFooter: 'st',
    },
    {
      header: 'Auditor',
      field: 'd.auditor',
      fieldSecondFooter: 'adr',
    },
    {
      header: 'Audit Date',
      field: 'd.auditor_date',
      fieldSecondFooter: 'auditor_d',
    },
    {
      header: 'Remark',
      field: 'd.deposit_remark',
      fieldSecondFooter: 'rk',
    },
  ];
  length: number = 0;
  deposit: PaginateRequest = new PaginateRequest();
  actionSetting: ActionSetting = new ActionSetting({
    type: 'choice',
    textCancel: 'Reject',
    textConfirm: 'Approved',
    onCancel: (data) => {
      this.changeStatus(data, 'REJECT');
    },
    onConfirm: (data) => {
      this.changeStatus(data, 'APPROVE');
    },
    showFunction: (row) => {
      if (row['d.status'] == 'PENDING') {
        return true;
      }
      return false;
    },
  });
  tr: any = [
    'd.deposit_order',
    'd.created_date',
    'd.username',
    'c.real_name',
    'd.amount',
    'd.beforeBalance',
    'd.afterBalance',
    'ca.bank',
    'ca.bank_account',
    'ca.account_name',
    'd.status',
    'd.auditor',
    'd.auditor_date',
    'd.deposit_remark',
    'action',
  ];

  dataInput: any = [];

  trSecond = [
    'Total',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'totalDepositFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
  ];

  animal: string;
  name: string;
  formFilter: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private baseService: BaseService,
    private fb: FormBuilder
  ) {
    this.formFilter = this.fb.group({
      startDate: [this.firstDate],
      endDate: [this.maxDate],
      playerId: [null],
      min: [null],
      max: [null],
      status: ['ALL'],
    });
  }

  ngOnInit(): void {
    this.fatchDepositList2();
  }
  openDialog(data): void {
    const dialogRef = this.dialog.open(DepositRequestDetailComponent, {
      width: '90%',
      data: { depositOrder: data.depositOrder },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      this.animal = result;
    });
  }

  depositSelect: any[] = [
    { name: 'Player ID', value: 'username' },
    { name: 'Deposit ID', value: 'deposit_order' },
  ];

  changeStatus(data, status) {
    // let amount = data.amount.replace(/,/g, '')
    let depositOrder = data['d.deposit_order'];
    let amount = data['d.amount'];
    let username = data['d.username'];
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.baseService
          .doPost('deposit/change-status', {
            depositOrder: depositOrder,
            username: username,
            status: status,
            amount: amount,
          })
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
              this.fatchDepositList2();
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }

  pageChange(event: PageChangeModel) {
    this.deposit.page = event.pageIndex;
    this.deposit.length = event.pageSize;
    this.fatchDepositList2();
  }
  sortChange(event: SortChangeModel) {
    this.deposit.sort = [];
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.deposit.sort.push(sort);
    }
    this.fatchDepositList2();
  }

  fatchDepositList2() {
    let wordSort: PaginateSort = new PaginateSort();
    wordSort.column = 'd.created_date';
    wordSort.order = 'desc';
    this.deposit.sort.push(wordSort);
    if (this.dateType == 'Deposit Date') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'd.created_date';
      wordFilter.op = 'between';
      wordFilter.value = moment(this.formFilter.controls.startDate.value)
        .format('YYYY/MM/DD HH:mm:ss')
        .toString();
      wordFilter.value1 = moment(this.formFilter.controls.endDate.value)
        .format('YYYY/MM/DD HH:mm:ss')
        .toString();
      this.deposit.filter.push(wordFilter);
    } else {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'd.auditor_date';
      wordFilter.op = 'between';
      wordFilter.value = moment(this.formFilter.controls.startDate.value)
        .format('YYYY/MM/DD HH:mm:ss')
        .toString();
      wordFilter.value1 = moment(this.formFilter.controls.endDate.value)
        .format('YYYY/MM/DD HH:mm:ss')
        .toString();
      this.deposit.filter.push(wordFilter);
    }
    if (this.formFilter.controls.playerId.value != null) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'd.username';
      wordFilter.op = '=';
      wordFilter.value = this.formFilter.controls.playerId.value;
      this.deposit.filter.push(wordFilter);
    }
    if (this.formFilter.controls.min.value) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'd.amount';
      wordFilter.op = '>=';
      wordFilter.value = this.formFilter.controls.min.value;
      this.deposit.filter.push(wordFilter);
    }
    if (this.formFilter.controls.max.value) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'd.amount';
      wordFilter.op = '<=';
      wordFilter.value = this.formFilter.controls.max.value;
      this.deposit.filter.push(wordFilter);
    }
    if (this.formFilter.controls.status.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'd.status';
      wordFilter.op = '=';
      wordFilter.value = this.formFilter.controls.status.value;
      this.deposit.filter.push(wordFilter);
    }

    this.baseService.doPost(URL.GET_DEPOSIT, this.deposit).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.dataList.data.map((data) => {
          return {
            'd.deposit_order': data.depositOrder,
            'd.created_date': moment(data.createdDate).format(
              'DD/MM/YYYY HH:mm:ss'
            ),
            'd.username': data?.username,
            'c.real_name':
              data.realname +
              (data?.depositType != null ? ' / ' + data?.depositType : ' '),
            'd.amount': data?.deposit,
            'd.beforeBalance': data.beforeBalance,
            'd.afterBalance': data.afterBalance,
            'ca.bank': data.companyBankName,
            'ca.bank_account': data.companyAccountNumber,
            'ca.account_name': data.companyAccountName,
            'd.status': data.status,
            'd.auditor': data.auditor,
            'd.auditor_date':
              data.auditorDate != null
                ? moment(data.auditorDate).format('DD/MM/YYYY HH:mm:ss')
                : '-',
            'd.deposit_remark':
              data?.depositRemark != null || data?.depositRemark != ''
                ? '-'
                : data?.depositRemark,
            // companyAccountNumber: "6062053555"
            // companyBankCode: "BBL"
          };
        });
        this.columns[4].footer = res.data.summary.subTotalDeposit;
        this.columns[4].footerSecondValue = res.data.summary.totalDeposit;
        this.length = res.data.dataList.recordsTotal;
      }
      this.deposit.filter = [];
      this.deposit.sort = [];
    });
  }

  onKeyup(event: any) {
    if (event.length >= 3) this.findUsername(event);
    else if (event.length < 3) this.options = [];
  }
  onSelectionChanged(event: any) {
    this.findUsername(event);
  }
  clearSearchField() {
    this.formFilter.controls.playerId.setValue(null);
  }
  findUsername(username) {
    this.baseService.doGet(URL.FIND_USERNAME + username).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.options = res.data;
        this.filteredOptions = this.formFilter.controls.playerId.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      }
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.options.filter((option) => option.includes(filterValue));
  }

  resetSearch() {
    this.formFilter.controls.startDate.setValue(this.firstDate);
    this.formFilter.controls.endDate.setValue(this.maxDate);
    this.formFilter.controls.playerId.setValue(null);
    this.formFilter.controls.min.setValue(null);
    this.formFilter.controls.max.setValue(null);
    this.formFilter.controls.status.setValue('ALL');
  }
  searchData() {
    this.fatchDepositList2();
    this.deposit.page = 0;
  }
}
