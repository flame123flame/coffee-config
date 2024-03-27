import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { FilterOp, PaginateRequest } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  PAGINATE: 'cashback/pending-paginate',
  APPROVE_ALL: 'cashback/approve-all-cashback',
  APPROVE: 'cashback/approve-cashback',
  REJECT_ALL: 'cashback/reject-all-cashback',
  REJECT: 'cashback/reject-cashback',
  GET_VIP_LIST: 'groupLevel/getAllGroupLevel'
}
@Component({
  selector: 'app-cashback-pending-new',
  templateUrl: './cashback-pending-new.component.html',
  styleUrls: ['./cashback-pending-new.component.scss']
})
export class CashbackPendingNewComponent implements OnInit {
  columns: any = [
    { header: 'Cashback Title', field: 'tb.cashback_title' },
    { header: 'Is Auto', field: 'tb.is_auto' },
    { header: 'Condition Multiple', field: 'tb.condition_multiple' },
    { header: 'Date Period Type', field: 'tb.date_period_type' },
    { header: 'Username', field: 'tb.username' },
    { header: 'Total Loss', field: 'tb.total_loss' },
    { header: 'Received Amount', field: 'tb.received_amount' },
  ];

  tr: any = [
    'tb.cashback_title',
    'tb.is_auto',
    'tb.condition_multiple',
    'tb.date_period_type',
    'tb.username',
    'tb.total_loss',
    'tb.received_amount',
    'action',
  ];
  data: any = [];
  searchName = null;
  searchVip = null

  constructor(private httpService: BaseService) {

  }

  ngOnInit(): void {
    this.getDataPaginate();
  }

  param: PaginateRequest = new PaginateRequest({
    filter: [
      {
        column: 'status',
        op: FilterOp.EQUAL,
        value: 'WAITING',
      }
    ]
  });


  length: number = 0;
  getDataPaginate() {
    this.httpService.doPost(URL.PAGINATE, this.param).subscribe(data => {
      if (data.status == "SUCCESS") {
        this.length = data.data.length
        this.data = data.data.data.map(ele => {
          return {
            'tb.before_balance': ele.beforeBalance,
            'tb.cashback_code': ele.cashbackCode,
            'tb.cashback_title': ele.cashbackTitle,
            'tb.code': ele.code,
            'tb.condition_multiple': ele.conditionMultiple,
            'tb.current_balance': ele.currentBalance,
            'tb.date_period_type': ele.datePeriodType,
            'tb.deposit': ele.deposit,
            'tb.id': ele.id,
            'tb.is_auto': ele.isAuto ? 'Yes' : 'No',
            'tb.receive_date': ele.receiveDate,
            'tb.received_amount': ele.receivedAmount,
            'tb.status': ele.status,
            'tb.username': ele.username,
            'tb.withdraw': ele.withdraw,
            'tb.total_loss': ele.totalLoss,
          }
        })
      }
    })
  }

  actionSetting: ActionSetting = new ActionSetting({
    type: 'choice',
    textCancel: 'Reject',
    textConfirm: 'Approved',
    onCancel: (data) => {
      this.doReject(data.code);
    },
    onConfirm: (data) => {
      this.doApprove(data.code);
    },
    showFunction: (row) => {
      if (row['tb.status'] == 'WAITING' && row['tb.is_auto'] == "No") {
        return true
      }
      return false
    }
  })

  doApprove(code) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.CONFIRM, () => {
      this.httpService.doGet(`${URL.APPROVE}/${code}`).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })
  }
  doReject(code) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.CONFIRM, () => {
      this.httpService.doGet(`${URL.REJECT}/${code}`).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })
  }

  vipList: any[] = []

  getVipList() {
    this.httpService.doGet(`${URL.GET_VIP_LIST}`).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.vipList = res.data
      }
    });
  }

  search() {
    this.param.filter = [
      {
        column: 'status',
        op: FilterOp.EQUAL,
        value: 'WAITING',
      }
    ]

    if (this.searchName) {
      this.param.filter.push(
        {
          column: 'cashback_title',
          op: FilterOp.CONTAIN,
          value: this.searchName,
        }
      )
    }

    if (this.searchVip) {
      this.param.filter.push(
        {
          column: 'status',
          op: FilterOp.CONTAIN,
          value: this.searchVip,
        }
      )
    }
    this.getDataPaginate()
  }

  reset() {
    this.searchName = null;
    this.searchVip = null;
    this.getDataPaginate()
  }



}
