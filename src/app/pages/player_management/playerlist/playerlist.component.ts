import { start } from 'repl';
import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { Color } from 'ng2-charts';
import { MessageService } from './../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from './../../../service/BaseService.service';
import * as moment from 'moment';
import {
  FilterOp,
  PaginateFilter,
  PaginateRequest,
  PaginateSort,
} from 'src/app/models/PaginateRequest';
import {
  PageChangeModel,
  SortChangeModel,
} from 'src/app/models/MatTableChange';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { type } from 'os';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDatePickerService } from 'src/app/service/MatDatePickerService.service';
const URL = {
  GET_ALL_LIST: 'customer/get-customer-all',
  GET_CUSTOMER_PAGINATE: 'customer/get-customer-paginate',
  UPDATE_ENABLE_USRNAME: 'customer/change-enable',
  DROPDOWN_GROUP: 'groupLevel/getAllGroupLevel',
  DROPDOWN_TAG: 'tag-management',
  FIND_USERNAME: 'customer/get-user/',
};
@Component({
  selector: 'app-playerlist',
  templateUrl: './playerlist.component.html',
  styleUrls: ['./playerlist.component.scss'],
})
export class PlayerListComponent implements OnInit {
  form: FormGroup;
  columns = [
    {
      header: 'Palyer ID',
      field: 'c.username',
      type: 'link',
      onClick: (data) => {
        console.log(data);
        this.router.navigate(['player-management/player-list/player-profile'], {
          queryParams: {
            username: data['c.username'],
          },
        });
      },
    },
    {
      header: 'Real Name',
      field: 'c.real_name',
    },
    {
      header: 'Gropup',
      field: 'gl.group_name',
    },
    {
      header: 'Tag Name',
      field: 'tag_name',
    },
    {
      header: 'Register Date',
      field: 'aln.register_date',
      type: 'textCenter',
    },
    {
      header: 'Total Balance',
      field: 'wl.balance',
      type: 'pipeNumber',
    },
    {
      header: 'Total Bonus',
      field: 'wl.bonus',
      type: 'pipeNumber',
    },
    {
      header: 'Total Deposit',
      field: 'dt.total_deposit',
      type: 'pipeNumber',
    },
    {
      header: 'Total Withdrawal',
      field: 'w.total_withdraw',
      type: 'pipeNumber',
    },
    {
      header: 'Last Login',
      field: 'c.last_login_date',
      type: 'textCenter',
    },
    {
      header: 'Status',
      field: 'c.enable',
      type: 'textCenter',
    },
  ];

  dataInput = [];

  tr: any = [
    'c.username',
    'c.real_name',
    'gl.group_name',
    'tag_name',
    'aln.register_date',
    'wl.balance',
    'wl.bonus',
    'dt.total_deposit',
    'w.total_withdraw',
    'c.last_login_date',
    'c.enable',
    'action',
  ];

  dateTypeOptions: string[] = ['Last Login Date', 'Registered Date'];
  dateType = this.dateTypeOptions[0];
  balanceTypeOptions: string[] = [
    'Total Balance',
    'Total Bonus',
    'Total Deposit',
    'Total Withdrawal',
  ];
  balanceType = 'ALL';
  dataLength: number = 0;
  dataPG: PaginateRequest = new PaginateRequest();

  groupList = [];
  actionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: false,
    listIcon: [
      {
        color: 'red',
        icon: 'cancel',
        action: (row) => {
          this.onDialogBlockUser(row);
        },
        type: 'icon',
        tooltip: 'block player',
      },
    ],
  });
  today = new Date();
  firstlastDayOfMonth = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    1
  );
  lastDayOfMonth = new Date(
    this.today.getFullYear(),
    this.today.getMonth() + 1,
    0
  );
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  constructor(
    private router: Router,
    private httpService: BaseService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      startDate: [this.firstlastDayOfMonth],
      endDate: [this.lastDayOfMonth],
      from: [null],
      to: [null],
      playerId: [null],
      realName: [null],
      phoneNumber: [null],
      groupCode: ['ALL'],
    });
  }

  ngOnInit(): void {
    this.dropdownTag();
    this.dropdownGroup();
    this.getCustomerPaginate();
  }

  onClick() {
    this.router.navigate([
      'player-management/player-list/playerlist-new-player',
    ]);
  }
  onClickT() {
    this.router.navigate(['player-management/player-list/player-profile']);
  }

  getCustomerPaginate() {
    if (this.dateType == 'Last Login Date') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'c.last_login_date';
      wordFilter.op = FilterOp.BETWEEN;
      wordFilter.value = MatDatePickerService.fixDateReduceOneDay(
        this.form.controls.startDate.value,
        MatDatePickerService.DateOption.START_OF_DAY
      );
      wordFilter.value1 = MatDatePickerService.fixDateReduceOneDay(
        this.form.controls.endDate.value,
        MatDatePickerService.DateOption.END_OF_DAY
      );
      this.dataPG.filter.push(wordFilter);
    } else {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'aln.last_login_date';
      wordFilter.op = FilterOp.BETWEEN;
      wordFilter.value = this.form.controls.from.value;
      wordFilter.value1 = this.form.controls.to.value;
      this.dataPG.filter.push(wordFilter);
    }
    if (this.balanceType === 'Total Balance') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'wl.balance';
      wordFilter.op = FilterOp.BETWEEN;
      wordFilter.value = this.form.controls.from.value;
      wordFilter.value1 = this.form.controls.to.value;
      this.dataPG.filter.push(wordFilter);
    } else if (this.balanceType === 'Total Bonus') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'wl.bonus';
      wordFilter.op = FilterOp.BETWEEN;
      wordFilter.value = this.form.controls.from.value;
      wordFilter.value1 = this.form.controls.to.value;
      this.dataPG.filter.push(wordFilter);
    } else if (this.balanceType === 'Total Deposit') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'dt.total_deposit';
      wordFilter.op = FilterOp.BETWEEN;
      wordFilter.value = this.form.controls.from.value;
      wordFilter.value1 = this.form.controls.to.value;
      this.dataPG.filter.push(wordFilter);
    } else if (this.balanceType === 'Total Withdrawal') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'w.total_withdraw';
      wordFilter.op = FilterOp.BETWEEN;
      wordFilter.value = this.form.controls.from.value;
      wordFilter.value1 = this.form.controls.to.value;
      this.dataPG.filter.push(wordFilter);
    }

    if (this.form.controls.playerId.value) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'c.username';
      wordFilter.op = FilterOp.EQUAL;
      wordFilter.value = this.form.controls.playerId.value;
      this.dataPG.filter.push(wordFilter);
    }
    if (this.form.controls.realName.value) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'c.real_name';
      wordFilter.op = FilterOp.EQUAL;
      wordFilter.value = this.form.controls.realName.value;
      this.dataPG.filter.push(wordFilter);
    }
    if (this.form.controls.phoneNumber.value) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'c.mobile_phone';
      wordFilter.op = FilterOp.EQUAL;
      wordFilter.value = this.form.controls.phoneNumber.value;
      this.dataPG.filter.push(wordFilter);
    }
    if (this.form.controls.groupCode.value != 'ALL') {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'c.group_code';
      wordFilter.op = FilterOp.EQUAL;
      wordFilter.value = this.form.controls.groupCode.value;
      this.dataPG.filter.push(wordFilter);
    }

    let wordFilter1: PaginateFilter = new PaginateFilter();
    wordFilter1.column = 'c.register_status';
    wordFilter1.op = FilterOp.EQUAL;
    wordFilter1.value = '2';
    this.dataPG.filter.push(wordFilter1);

    this.httpService
      .doPost(URL.GET_CUSTOMER_PAGINATE, this.dataPG)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.dataInput = res.data.data.map((data) => {
            return {
              'c.username': data.username,
              'c.real_name': data.realName,
              'gl.group_name': data.groupName,
              tag_name: data.tagName,
              'aln.register_date': data.registerDate
                ? moment(data.registerDate).format('DD/MM/YYYY HH:mm:ss')
                : '-',
              'wl.balance': data.balance,
              'wl.bonus': data.bonus,
              'dt.total_deposit': data.totalDeposit,
              'w.total_withdraw': data.withdraw,
              'c.last_login_date': data.lastLoginDate
                ? moment(data.lastLoginDate).format('DD/MM/YYYY HH:mm:ss')
                : ' ',
              'c.enable': data.enable ? 'Active' : 'Disabled',
            };
          });
          this.dataLength = res.data.recordsTotal;
        }
        this.dataPG.filter = [];
      });
  }

  pageChange(event: PageChangeModel) {
    this.dataPG.page = event.pageIndex;
    this.dataPG.length = event.pageSize;
    this.getCustomerPaginate();
  }

  sortChange(event: SortChangeModel) {
    this.dataPG.sort = [];
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.dataPG.sort.push(sort);
    }
    this.getCustomerPaginate();
  }

  onDialogBlockUser(data) {
    console.log(data);
    if (data.enable === 'Active') {
      console.log(data.enable);
      DialogSweetAlertService.opentModalSweetAlertConfirm(
        '',
        MessageService.DIALOGMSGCONFIRM.BLOCK_USERNAME,
        () => {
          this.httpService
            .doPut(URL.UPDATE_ENABLE_USRNAME, {
              username: data.username,
              enable: false,
            })
            .subscribe((res) => {
              if (MessageService.MSG.SUCCESS == res.status) {
                DialogSweetAlertService.opentModalSweetAlertSuccess(
                  '',
                  res.message
                );
                this.getCustomerPaginate();
              } else {
                DialogSweetAlertService.opentModalSweetAlertError(
                  '',
                  res.message
                );
              }
            });
        }
      );
    } else {
      console.log(data.enable);
      DialogSweetAlertService.opentModalSweetAlertConfirm(
        '',
        MessageService.DIALOGMSGCONFIRM.UN_BLOCK_USERNAME,
        () => {
          this.httpService
            .doPut(URL.UPDATE_ENABLE_USRNAME, {
              username: data.username,
              enable: true,
            })
            .subscribe((res) => {
              if (MessageService.MSG.SUCCESS == res.status) {
                DialogSweetAlertService.opentModalSweetAlertSuccess(
                  '',
                  res.message
                );
                this.getCustomerPaginate();
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
  }

  dropdownTag() {
    this.httpService.doGet(URL.DROPDOWN_TAG).subscribe((res) => {});
  }
  dropdownGroup() {
    this.httpService.doGet(URL.DROPDOWN_GROUP).subscribe((res) => {
      this.groupList = res.data;
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
    this.form.controls.playerId.setValue(null);
  }
  findUsername(username) {
    this.httpService.doGet(URL.FIND_USERNAME + username).subscribe((res) => {
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

  searchUser() {
    this.getCustomerPaginate();
  }
  resetSearch() {
    this.form.controls.startDate.setValue(this.firstlastDayOfMonth);
    this.form.controls.endDate.setValue(this.lastDayOfMonth);
    this.form.controls.from.setValue(null);
    this.form.controls.to.setValue(null);
    this.form.controls.playerId.setValue(null);
    this.form.controls.realName.setValue(null);
    this.form.controls.phoneNumber.setValue(null);
    this.form.controls.groupCode.setValue('ALL');
    this.dateType = this.dateTypeOptions[0];
    this.balanceType = 'ALL';
    this.searchUser();
  }
}
