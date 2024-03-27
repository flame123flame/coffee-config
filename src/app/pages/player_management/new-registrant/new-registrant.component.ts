import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActionSetting, EditIcon } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';

const URL = {
  GET_ALL_PAGINATE: 'new-registrant/get-paginate',
  GET_COUNT_TODAY: 'new-registrant/get-count-to-day',
  GET_COUNT_TOWEEK: 'new-registrant/get-count-to-week',
  GET_COUNT_TO_LASTWEEK: 'new-registrant/get-count-to-Lastweek',
  EDIT_ENACLE: 'new-registrant/edit-enable'
}
@Component({
  selector: 'app-new-registrant',
  templateUrl: './new-registrant.component.html',
  styleUrls: ['./new-registrant.component.scss'],
})
export class NewRegistrantComponent implements OnInit {
  actionSetting: ActionSetting = new ActionSetting({})

  selected = false;
  selected1 = false;
  selected2 = false;
  selected3 = false;
  selected4 = false;
  selected5 = false;

  setDate = {
    startDate: null,
    endDate: null,
    amount: null
  }




  customer = [];
  columns = [
    {
      header: 'Affiliate',
      field: 'affiliateCode',
    },
    {
      header: 'Player ID',
      field: 'username',
    },
    {
      header: 'Real Name',
      field: 'realName',
    },
    {
      header: 'Tag Name',
      field: 'tagName',
    },
    {
      header: 'Deposit Amt.',
      field: 'amount',
      type: 'pipeNumber',
    },
    {
      header: 'Current Balance',
      field: 'balance',
      type: 'pipeNumber',
    },
    {
      header: 'Registered Date',
      field: 'registerDate',
      // type: 'textCenter',
    },
    {
      header: 'Registered IP',
      field: 'registeredIp',
      // type: 'textCenter',
    },
    {
      header: 'Status',
      field: 'enable',
    },
  ];

  dataInput = [];

  tr: any = [
    'affiliateCode',
    'username',
    'realName',
    'tagName',
    'amount',
    'balance',
    'registerDate',
    'registeredIp',
    'enable',
    'action',
  ];

  countToDay = [];
  countToWeek = [];
  countToLastweek = [];

  dataLength: number = 0;
  dataPG: PaginateRequest = new PaginateRequest();

  constructor(
    private httpService: BaseService,
    private tagSer: BaseService,
  ) {
    this.actionSetting.hideEdit = false
    this.actionSetting.hideDelete = false

    this.actionSetting.listIcon = [];
    const Icon5: EditIcon = new EditIcon();
    Icon5.icon = 'highlight_off';
    Icon5.color = '#ff1100';
    Icon5.action = (data) => {
      console.log(data)
      this.editEnable(data)
    };
    this.actionSetting.listIcon.push(Icon5);

  }

  ngOnInit(): void {
    this.getCountToDay();
    this.getCountToWeek();
    this.getCountToLastweek();
    this.onSelectCard()
  }

  getCountToDay() {
    this.httpService.doGet(URL.GET_COUNT_TODAY).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.countToDay = res.data
      }
    })
  }

  getCountToWeek() {
    this.httpService.doGet(URL.GET_COUNT_TOWEEK).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.countToWeek = res.data
      }
    })
  }

  getCountToLastweek() {
    this.httpService.doGet(URL.GET_COUNT_TO_LASTWEEK).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.countToLastweek = res.data
      }
    })
  }

  onSelectCard() {
    this.selected = !this.selected;
    if (this.selected1 = false) {
      this.selected1 = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected5 = false;
    }
    else {
      this.selected = true;
      this.selected1 = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected5 = false;
    }
    this.setDate.startDate = moment().format("yyyy-MM-DDT00:00:00");
    this.setDate.endDate = moment().format("yyyy-MM-DDT23:59:59");
    this.setDate.amount = 1
    this.getpaginate();

  }

  onSelectCard1() {
    this.selected1 = !this.selected1;
    if (this.selected = false) {
      this.selected = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected5 = false;
    } else {
      this.selected1 = true;
      this.selected = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected5 = false;
    }
    this.setDate.startDate = moment().day(1).format("yyyy-MM-DDT00:00:00");
    this.setDate.endDate = moment().day(7).format("yyyy-MM-DDT23:59:59");
    this.setDate.amount = 1
    this.getpaginate();
  }

  onSelectCard2() {
    this.selected2 = !this.selected2;
    if (this.selected = false) {
      this.selected1 = false;
      this.selected = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected5 = false;
    } else {
      this.selected2 = true;
      this.selected1 = false;
      this.selected = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected5 = false;
    }
    this.setDate.startDate = moment().day(-6).format("yyyy-MM-DDT00:00:00");
    this.setDate.endDate = moment().day(0).format("yyyy-MM-DDT23:59:59");
    this.setDate.amount = 1
    this.getpaginate();
  }

  onSelectCard3() {
    this.selected3 = !this.selected3;
    if (this.selected = false) {
      this.selected1 = false;
      this.selected2 = false;
      this.selected = false;
      this.selected4 = false;
      this.selected5 = false;
    } else {
      this.selected3 = true;
      this.selected1 = false;
      this.selected2 = false;
      this.selected = false;
      this.selected4 = false;
      this.selected5 = false;
    }
    this.setDate.startDate = moment().format("yyyy-MM-DDT00:00:00");
    this.setDate.endDate = moment().format("yyyy-MM-DDT23:59:59");
    this.setDate.amount = 0
    this.getpaginate();
  }

  onSelectCard4() {
    this.selected4 = !this.selected4;
    if (this.selected = false) {
      this.selected1 = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected = false;
      this.selected5 = false;
    } else {
      this.selected4 = true;
      this.selected1 = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected = false;
      this.selected5 = false;
    }

    this.setDate.startDate = moment().day(1).format("yyyy-MM-DDT00:00:00");
    this.setDate.endDate = moment().day(7).format("yyyy-MM-DDT23:59:59");
    this.setDate.amount = 0
    this.getpaginate();
  }

  onSelectCard5() {
    this.selected5 = !this.selected5;
    if (this.selected = false) {
      this.selected1 = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected = false;
    } else {
      this.selected5 = true;
      this.selected1 = false;
      this.selected2 = false;
      this.selected3 = false;
      this.selected4 = false;
      this.selected = false;
    }
    this.setDate.startDate = moment().day(-6).format("yyyy-MM-DDT00:00:00");
    this.setDate.endDate = moment().day(0).format("yyyy-MM-DDT23:59:59");
    this.setDate.amount = 0
    this.getpaginate();
  }

  setSearch() {
    this.dataPG.filter = [];
    if (this.setDate.startDate && this.setDate.endDate) {
      this.dataPG.filter.push({ column: 'an.register_date', op: 'between', value: this.setDate.startDate.trim(), value1: this.setDate.endDate.trim() });
    }
    if (this.setDate.amount == 0) {
      this.dataPG.filter.push({ column: 'amount', op: '>', value: '0', value1: '' });
    }
  }


  getpaginate() {
    this.setSearch()
    this.httpService.doPost(URL.GET_ALL_PAGINATE, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.data.map(data => {
          return {
            affiliateCode: data.affiliateCode,
            username: data.username,
            realName: data.realName,
            tagName: data.tagName,
            amount: data.totalDeposit,
            balance: data.balance,
            registerDate: data.registerDate ? moment(data.registerDate).format('DD/MM/YYYY HH:mm:ss') : '-',
            registeredIp: data.registeredIp,
            enable: data.enable ? "Active" : "Disabled",
          }
        })
        this.dataLength = res.data.recordsTotal
      }
      this.dataPG.sort = []
    })
  }


  pageChange(event: PageChangeModel) {
    this.dataPG.page = event.pageIndex
    this.dataPG.length = event.pageSize
    this.getpaginate()
  }


  sortChange(event: SortChangeModel) {
    this.dataPG.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.dataPG.sort.push(sort)
    }
    this.getpaginate()
  }

  editEnable(data) {
    console.log(data);

    if (data.enable === 'Active') {
      console.log(data.enable);
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.BLOCK_USERNAME, () => {
        this.httpService.doPut(URL.EDIT_ENACLE, { username: data.username, enable: false }).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message)
            this.getpaginate()
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message)
          }
        })

      })

    }
    else {
      console.log(data.enable);
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.UN_BLOCK_USERNAME, () => {
        this.httpService.doPut(URL.EDIT_ENACLE, { username: data.username, enable: true }).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message)
            this.getpaginate()
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message)
          }
        })

      })
    }

    // this.httpService.doPut(URL.EDIT_ENACLE, data).subscribe(res => {
    //   if (MessageService.MSG.SUCCESS == res.status) {

    //   }
    // })
  }
}





