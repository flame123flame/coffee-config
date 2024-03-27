import { MatDatePickerService } from './../../../service/MatDatePickerService.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  GET_ALL_LIST: "customer/get-bank-verify",
  FIND_USERNAME: 'customer/get-user/',
  GET_BANK_VERIFY: 'customer/bank-verify-paginate',
  GET_BANK_VERIFY_DUPLICATE_AC: 'customer/bank-verify-duplicate-ac-paginate',
  GET_BANK_VERIFY_DUPLICATE_RL: 'customer/bank-verify-duplicate-rl-paginate',
  DROPDOWN_BANK: 'bank/get-bank-all',
  CHANGE_STATUS: 'customer/change-bank-status'

}
@Component({
  selector: 'app-bank-verify',
  templateUrl: './bank-verify.component.html',
  styleUrls: ['./bank-verify.component.scss']
})
export class BankVerifyComponent implements OnInit {
  form: FormGroup;
  columns = [
    {
      header: 'Palyer ID',
      field: 'username',
      type: 'link',
      onClick: (data) => {
        console.log(data);
        this.router.navigate(['player-management/player-list/player-profile'], {
          queryParams: {
            username: data.username
          }
        });
      },
    },
    { header: 'Real Name', field: 'realName' },
    { header: 'Bank Account', field: 'bankAccount', },
    { header: 'Bank Name', field: 'bankNameEn', },
    { header: 'Bank Name(TH)', field: 'bankNameTh', },
    { header: 'Register Date', field: 'registerDate', },
    { header: 'Status', field: 'bankStatus', type: 'textCenter' },
  ];

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
      if (row['bankStatus'] == 'PENDING') {
        return true
      }
      return false
    }
  })

  dataInput = [];

  tr: any = [
    'username',
    'realName',
    'bankAccount',
    'bankNameEn',
    'bankNameTh',
    'registerDate',
    'bankStatus',
    'action'
  ];
  tomorrow = new Date()
  minDate = new Date()

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchField
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 6,
    0,
    0)
  lastDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59)

  dataLength: number = 0;
  dataPG: PaginateRequest = new PaginateRequest();
  checkTable = "DEFAULT"
  bankList = []
  statusList = ['APPROVE', 'REJECT', 'PENDING']
  constructor(
    private router: Router,
    private httpService: BaseService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      startDate: [this.firstDate],
      endDate: [this.lastDate],
      playerId: [null],
      bankAccount: [null],
      bankCode: ['ALL'],
      bankStatus: ['ALL'],
    })
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.minDate.setDate(this.minDate.getDate() - 90)

  }

  ngOnInit(): void {
    this.getDropdownBank()
    this.searchBankVerify()
  }



  changeStatus(data, status) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.httpService.doPut(URL.CHANGE_STATUS, { username: data.username, bankStatus: status, })
        .subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.searchBankVerify()
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message)
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message)
          }

        });
    })

  }

  resetData() {
    this.form.controls.startDate.setValue(this.firstDate)
    this.form.controls.endDate.setValue(this.lastDate)
    this.form.controls.playerId.setValue(null)
    this.form.controls.bankAccount.setValue(null)
    this.form.controls.bankCode.setValue('ALL')
    this.form.controls.bankStatus.setValue('ALL')
  }




  onKeyup(event: any) {
    if (event.length >= 3)
      this.findUsername(event)
    else if (event.length < 3)
      this.options = []
  }

  onSelectionChanged(event: any) {
    this.findUsername(event)
    this.searchField = event
  }
  findUsername(username) {
    this.httpService.doGet(URL.FIND_USERNAME + username).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.options = res.data;
        this.filteredOptions = this.form.valueChanges
          .pipe(startWith(''), map(value => this._filter(value)));
      }
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.options.filter(option => option.includes(filterValue))
  }
  clearPlayerId() {
    this.form.controls.playerId.setValue(null)
    this.searchBankVerify()
  }
  clearBankAccount() {
    this.form.controls.bankAccount.setValue(null)
    this.searchBankVerify()
  }

  searchBankVerify() {
    if (this.checkTable == 'DEFAULT')
      this.searchBankVerifyDefault()
    else if (this.checkTable == 'DUPLICATEAC')
      this.searchBankVerifyDuplicateAc()
    else if (this.checkTable == 'DUPLICATERN')
      this.searchBankVerifyDuplicateRn()
  }




  searchBankVerifyDefault() {
    let wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = 'an.register_date';
    wordFilter.op = 'between'
    wordFilter.value = moment(this.form.controls.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    wordFilter.value1 = moment(this.form.controls.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
    this.dataPG.filter.push(wordFilter)
    let wordFilter1: PaginateFilter = new PaginateFilter();
    if (this.form.controls.playerId.value != null) {
      wordFilter1.column = 'c.username';
      wordFilter1.op = '='
      wordFilter1.value = this.form.controls.playerId.value
      this.dataPG.filter.push(wordFilter1)
    }
    let wordFilter2: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankAccount.value != null) {
      wordFilter2.column = 'c.bank_account';
      wordFilter2.op = '='
      wordFilter2.value = this.form.controls.bankAccount.value
      this.dataPG.filter.push(wordFilter2)
    }
    let wordFilter3: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankCode.value != 'ALL') {
      wordFilter3.column = 'c.bank_code';
      wordFilter3.op = '='
      wordFilter3.value = this.form.controls.bankCode.value
      this.dataPG.filter.push(wordFilter3)
    }
    let wordFilter4: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankStatus.value != 'ALL') {
      wordFilter4.column = 'c.bank_status';
      wordFilter4.op = '='
      wordFilter4.value = this.form.controls.bankStatus.value
      this.dataPG.filter.push(wordFilter4)
    }
    let wordSort: PaginateSort = new PaginateSort();
    wordSort.column = 'register_date'
    wordSort.order = 'DESC'
    this.dataPG.sort.push(wordSort)
    this.httpService.doPost(URL.GET_BANK_VERIFY, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.data.map(data => {
          return {
            bankAccount: data.bankAccount,
            bankCode: data.bankCode,
            bankNameEn: data.bankNameEn,
            bankNameTh: data.bankNameTh,
            bankStatus: data.bankStatus,
            realName: data.realName,
            username: data.username,
            registerDate: moment(data.registerDate).format('DD/MM/YYYY HH:mm:ss'),
            // enable: data.enable = 'Active' ? 'Active' : 'Disabled',
            // enable: data.enable,
            status: data.bankStatus,

          }
        })
        this.dataLength = res.data.recordsTotal
      }
      this.dataPG.filter = []
      this.dataPG.sort = []
    })
  }
  searchBankVerifyDuplicateAc() {
    let wordFilter1: PaginateFilter = new PaginateFilter();
    if (this.form.controls.playerId.value != null) {
      wordFilter1.column = 'c.username';
      wordFilter1.op = '='
      wordFilter1.value = this.form.controls.playerId.value
      this.dataPG.filter.push(wordFilter1)
    }
    let wordFilter2: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankAccount.value != null) {
      wordFilter2.column = 'c.bank_account';
      wordFilter2.op = '='
      wordFilter2.value = this.form.controls.bankAccount.value
      this.dataPG.filter.push(wordFilter2)
    }
    let wordFilter3: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankCode.value != 'ALL') {
      wordFilter3.column = 'c.bank_code';
      wordFilter3.op = '='
      wordFilter3.value = this.form.controls.bankCode.value
      this.dataPG.filter.push(wordFilter3)
    }
    let wordFilter4: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankStatus.value != 'ALL') {
      wordFilter4.column = 'c.bank_status';
      wordFilter4.op = '='
      wordFilter4.value = this.form.controls.bankStatus.value
      this.dataPG.filter.push(wordFilter4)
    }
    let wordSort: PaginateSort = new PaginateSort();
    wordSort.column = 'c.bank_account,an.register_date'
    wordSort.order = 'DESC'
    this.dataPG.sort.push(wordSort)
    this.httpService.doPost(URL.GET_BANK_VERIFY_DUPLICATE_AC, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.data.map(data => {
          return {
            bankAccount: data.bankAccount,
            bankCode: data.bankCode,
            bankNameEn: data.bankNameEn,
            bankNameTh: data.bankNameTh,
            bankStatus: data.bankStatus,
            realName: data.realName,
            username: data.username,
            registerDate: moment(data.registerDate).format('DD/MM/YYYY HH:mm:ss'),
            // enable: data.enable = 'Active' ? 'Active' : 'Disabled',
            // enable: data.enable,
            status: data.bankStatus,

          }
        })
        this.dataLength = res.data.recordsTotal
      }
      this.dataPG.filter = []
      this.dataPG.sort = []
    })
  }

  searchBankVerifyDuplicateRn() {
    let wordFilter1: PaginateFilter = new PaginateFilter();
    if (this.form.controls.playerId.value != null) {
      wordFilter1.column = 'c.username';
      wordFilter1.op = '='
      wordFilter1.value = this.form.controls.playerId.value
      this.dataPG.filter.push(wordFilter1)
    }
    let wordFilter2: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankAccount.value != null) {
      wordFilter2.column = 'c.bank_account';
      wordFilter2.op = '='
      wordFilter2.value = this.form.controls.bankAccount.value
      this.dataPG.filter.push(wordFilter2)
    }
    let wordFilter3: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankCode.value != 'ALL') {
      wordFilter3.column = 'c.bank_code';
      wordFilter3.op = '='
      wordFilter3.value = this.form.controls.bankCode.value
      this.dataPG.filter.push(wordFilter3)
    }
    let wordFilter4: PaginateFilter = new PaginateFilter();
    if (this.form.controls.bankStatus.value != 'ALL') {
      wordFilter4.column = 'c.bank_status';
      wordFilter4.op = '='
      wordFilter4.value = this.form.controls.bankStatus.value
      this.dataPG.filter.push(wordFilter4)
    }
    let wordSort: PaginateSort = new PaginateSort();
    wordSort.column = 'c.real_name,an.register_date'
    wordSort.order = 'DESC'
    this.dataPG.sort.push(wordSort)
    this.httpService.doPost(URL.GET_BANK_VERIFY_DUPLICATE_RL, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.data.map(data => {
          return {
            bankAccount: data.bankAccount,
            bankCode: data.bankCode,
            bankNameEn: data.bankNameEn,
            bankNameTh: data.bankNameTh,
            bankStatus: data.bankStatus,
            realName: data.realName,
            username: data.username,
            registerDate: moment(data.registerDate).format('DD/MM/YYYY HH:mm:ss'),
            // enable: data.enable = 'Active' ? 'Active' : 'Disabled',
            // enable: data.enable,
            status: data.bankStatus,

          }
        })
        this.dataLength = res.data.recordsTotal
      }
      this.dataPG.filter = []
      this.dataPG.sort = []
    })
  }

  getDropdownBank() {
    this.httpService.doGet(URL.DROPDOWN_BANK).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.bankList = res.data
      }
    })
  }

  pageChange(event: PageChangeModel) {
    this.dataPG.page = event.pageIndex
    this.dataPG.length = event.pageSize
    this.searchBankVerify();
  }

  sortChange(event: SortChangeModel) {
    this.dataPG.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.dataPG.sort.push(sort)
    }
    this.searchBankVerify();
  }
}
