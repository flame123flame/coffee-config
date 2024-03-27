import { async } from '@angular/core/testing';
import { WithdrawalListRemarkDialogComponent } from './withdrawal-list-remark-dialog/withdrawal-list-remark-dialog.component';
import { ActionSetting, EditIcon } from './../../../models/ActionSettingModel';
import { RequestRespond, PaginateRespond } from './../../../models/RequestRespond';
import { PaginateFilter, PaginateRequest, PaginateSort } from './../../../models/PaginateRequest';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
const URL = {
  GET_PAGINATE: "withdraw/paginate",
  CHANGE_STATUS: "withdraw/change-status",
  UPDATE_REMARK: "withdraw/remark",
  GET_WITHDRAWAL: 'withdraw/get-withdrawal-list-paginate',
  FIND_USERNAME: 'customer/get-user/',
}
interface resData {
  id: number
  orderWithdraw: string
  createdDate: string;
  username: string;
  realName: string;
  bankAccount: string;
  bankName: string;
  amount: number
  companyBankName: string;
  companyAccountName: string;
  companyAccountNumber: string;
  withdrawStatus: string;
  auditor: string;
  auditDate: string;
  userRemark: string;
  adminRemark: string;
}
interface search {
  dateStart: Date,
  dateEnd: Date,
  username: String,
  amountMin: Number,
  amountMax: Number
}
interface resTotalData {
  subTotalWithdraw: 0
  totalWithdraw: 0
}
@Component({
  selector: 'app-withdrawal-list',
  templateUrl: './withdrawal-list.component.html',
  styleUrls: ['./withdrawal-list.component.scss'],
})
export class WithdrawalListComponent implements OnInit {
  STATUS_REJECT = "REJECT";
  STATUS_PENDING = "PENDING";
  STATUS_BANK_APPROVED = "BANK_APPROVED";
  STATUS_WITHDRAW_APPROVED = "WITHDRAW_APPROVED";
  selected1 = '1'
  search: search = {
    dateStart: null,
    dateEnd: null,
    username: null,
    amountMin: null,
    amountMax: null,
  }
  form: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  dateTypeOptions: string[] = ['Withdraw Date', 'Audit Date'];
  dateType = this.dateTypeOptions[0];
  statusTypeOptions: String[] = ['WITHDRAW_APPROVED', 'PENDING', 'REJECT']
  statusType = 'ALL'
  maxDate = new Date(new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23, 59, 59)
  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 90, 0, 0)
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1, 0, 0, 0)
  constructor(
    private router: Router,
    private baseSer: BaseService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    // this.getPaginate()
    this.form = this.fb.group({
      startDate: [this.firstDate],
      endDate: [this.maxDate],
      playerId: [null],
      min: [null],
      max: [null],
      status: ['ALL'],
    })
    this.actionConfig()
    this.getAllList()
  }
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add', onClick: () => {
        this.router.navigate(["/finance-management/withdrawal-list/withdrawal-list-add"]);
      }
    },
  ];

  tr: any = [
    // 'orderWithdraw',
    'createdDate',
    'username',
    'realName',
    'bankAccount',
    'bankName',
    'amount',
    'beforeBalance',
    'afterBalance',
    'companyBankName',
    'companyAccountName',
    'companyAccountNumber',
    'withdrawStatus',
    'auditor',
    'auditDate',
    'userRemark',
    'adminRemark',
    'action',
    'action2'
  ];
  data: resData[] = [];
  totalData = {
    subTotalWithdraw: 0,
    totalWithdraw: 0
  }
  trSeccond: any = [
    'totalWithdrawTitle',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'totalWithdraw',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
  ]
  length = 0;
  actionSetting: ActionSetting = new ActionSetting();

  ngOnInit(): void {

  }

  getAllList() {
    this.paginateReq.sort = []
    let sort: PaginateSort = new PaginateSort();
    sort.column = 'w.created_date'
    sort.order = 'desc'
    this.paginateReq.sort.push(sort)
    this.setFilter()
    this.baseSer.doPost(URL.GET_WITHDRAWAL, this.paginateReq).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.data = res.data.dataList.data.map(res => {
          return {
            id: res.id,
            orderWithdraw: res.orderWithdraw,
            createdDate: moment(res.createdDate).format('DD/MM/YYYY HH:mm:ss'),
            username: res.username,
            realName: res.realName,
            bankAccount: res.bankAccount,
            bankName: res.bankName,
            amount: res.amount,
            afterBalance: res.afterBalance,
            beforeBalance: res.beforeBalance,
            companyBankName: res.companyBankName,
            companyAccountName: res.companyAccountName,
            companyAccountNumber: res.companyAccountNumber,
            withdrawStatus: res.withdrawStatus,
            auditor: res.updatedBy ?? "-",
            auditDate: res.updatedDate != null ? moment(res.updatedDate).format('DD/MM/YYYY HH:mm:ss') : '-',
            userRemark: res.userRemark,
            adminRemark: res.adminRemark,
          }
        })
        this.totalData.subTotalWithdraw = res.data.summary.subTotalWithdraw
        this.totalData.totalWithdraw = res.data.summary.totalWithdraw
        this.length = res.data.dataList.recordsTotal;
      }
    })
    // this.paginateReq.filter.

    // this.baseSer.doPost(URL.GET_PAGINATE, this.paginateReq).subscribe((res: RequestRespond<PaginateRespond<resData>>) => {
    //   if (res.status == "SUCCESS") {
    //     // this.data = res.data.data;
    //     this.length = res.data.recordsTotal;
    //   }
    // })
  }

  actionConfig() {
    this.actionSetting.hideEdit = false
    this.actionSetting.hideDelete = false
    this.actionSetting.listIcon = []
    let but_approve_bank: EditIcon = new EditIcon();
    but_approve_bank.type = 'text';
    but_approve_bank.color = 'primary';
    but_approve_bank.action = (row: resData) => { this.changeStatus(row.id, this.STATUS_BANK_APPROVED) };
    but_approve_bank.text = 'APPROVE BANK';
    but_approve_bank.showFunction = (row: resData) => { return row.withdrawStatus === this.STATUS_PENDING };

    let but_approve_withdraw: EditIcon = new EditIcon();
    but_approve_withdraw.type = 'text';
    but_approve_withdraw.color = 'primary';
    but_approve_withdraw.action = (row: resData) => { this.changeStatus(row.id, this.STATUS_WITHDRAW_APPROVED) };
    but_approve_withdraw.text = 'APPROVE WITHDRAW';
    but_approve_withdraw.showFunction = (row: resData) => { return row.withdrawStatus === this.STATUS_BANK_APPROVED };

    let but_reject: EditIcon = new EditIcon();
    but_reject.type = 'text';
    but_reject.color = 'warn';
    but_reject.action = (row: resData) => { this.changeStatus(row.id, this.STATUS_REJECT) };
    but_reject.text = 'REJECT';
    but_reject.showFunction = (row) => { return row.withdrawStatus === this.STATUS_PENDING || row.withdrawStatus === this.STATUS_BANK_APPROVED };

    this.actionSetting.listIcon.push(but_approve_bank);
    this.actionSetting.listIcon.push(but_approve_withdraw);
    this.actionSetting.listIcon.push(but_reject);
  }
  resetFilter() {
    this.form.controls.startDate.setValue(this.firstDate)
    this.form.controls.endDate.setValue(this.maxDate)
    this.form.controls.playerId.setValue(null)
    this.form.controls.min.setValue(null)
    this.form.controls.max.setValue(null)
    this.form.controls.status.setValue('ALL')
    this.getAllList()
  }
  setFilter() {
    this.paginateReq.filter = []
    if (this.dateType == 'Withdraw Date') {
      let data: PaginateFilter = {
        column: "w.created_date",
        op: "between",
        value: moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString(),
        value1: moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
      }
      this.paginateReq.filter.push(data)
    } else {
      let data: PaginateFilter = {
        column: "w.updated_date",
        op: "between",
        value: moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString(),
        value1: moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
      }
      this.paginateReq.filter.push(data)
    }
    if (this.form.controls.playerId.value != null) {
      let data: PaginateFilter = {
        column: "w.username",
        op: "=",
        value: this.form.controls.playerId.value
      }
      this.paginateReq.filter.push(data)
    }
    if (this.form.controls.min.value) {
      let data: PaginateFilter = {
        column: "w.amount",
        op: ">=",
        value: this.form.controls.min.value
      }
      this.paginateReq.filter.push(data)
    }
    if (this.form.controls.max.value) {
      let data: PaginateFilter = {
        column: "w.amount",
        op: "<=",
        value: this.form.controls.max.value
      }
      this.paginateReq.filter.push(data)
    }
    if (this.form.controls.status.value != 'ALL') {
      let data: PaginateFilter = {
        column: "w.withdraw_status",
        op: "=",
        value: this.form.controls.status.value
      }
      this.paginateReq.filter.push(data)
    }
  }

  // getPaginate() {
  //   this.paginateReq.sort = []
  //   let sort: PaginateSort = new PaginateSort();
  //   sort.column = 'tb.created_date'
  //   sort.order = 'desc'
  //   this.paginateReq.sort.push(sort)
  //   // this.paginateReq.filter.
  //   this.setFilter()
  //   this.baseSer.doPost(URL.GET_PAGINATE, this.paginateReq).subscribe((res: RequestRespond<PaginateRespond<resData>>) => {
  //     if (res.status == "SUCCESS") {
  //       // this.data = res.data.data;
  //       this.length = res.data.recordsTotal;
  //     }
  //   })
  // }

  changeStatus(id: number, status: string) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.baseSer.doGet(`${URL.CHANGE_STATUS}/${id}/${status}`).subscribe((res: RequestRespond<any>) => {
        if (MessageService.MSG.SUCCESS = res.status) {
          // this.getPaginate();
          this.getAllList()
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        }
        else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      });
    })

  }

  updateRemark(id: number, remark: string) {
    return this.baseSer.doPost(`${URL.UPDATE_REMARK}/${id}`, { adminRemark: remark }).toPromise();
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(WithdrawalListRemarkDialogComponent,
      { width: '600px', maxWidth: '95%', maxHeight: '90%', height: 'fit-content' });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.status == "SUCCESS") {
        let res = await this.updateRemark(element.id, result.data);
        this.changeStatus(element.id, this.STATUS_REJECT);
      }
    });
  }


  paginateReq: PaginateRequest = new PaginateRequest();

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex
    this.paginateReq.length = event.pageSize
    // this.getPaginate();
    this.getAllList()
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.paginateReq.sort.push(sort)
    }
    // this.getPaginate();
    this.getAllList()
  }

  onKeyup(event: any) {
    if (event.length >= 3) this.findUsername(event);
    else if (event.length < 3) this.options = [];
  }
  onSelectionChanged(event: any) {
    this.findUsername(event);
  }
  clearSearchField() {
    this.form.controls.playerId.setValue(null);
  }
  findUsername(username) {
    this.baseSer.doGet(URL.FIND_USERNAME + username).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.options = res.data;
        this.filteredOptions = this.form.controls.playerId.valueChanges.pipe(
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
    this.form.controls.startDate.setValue(this.firstDate)
    this.form.controls.endDate.setValue(this.maxDate)
    this.form.controls.playerId.setValue(null)
    this.form.controls.min.setValue(null)
    this.form.controls.max.setValue(null)
    this.form.controls.status.setValue('ALL')
  }
  searchData() {

  }
}
