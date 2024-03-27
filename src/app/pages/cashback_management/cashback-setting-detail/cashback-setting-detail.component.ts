import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  CASHBACK_DETAIL: 'cashback/get-detail',
  APPROVE_ALL: 'cashback/approve-all-cashback',
  APPROVE: 'cashback/approve-cashback',
  REJECT_ALL: 'cashback/reject-all-cashback',
  REJECT: 'cashback/reject-cashback'
}
@Component({
  selector: 'app-cashback-setting-detail',
  templateUrl: './cashback-setting-detail.component.html',
  styleUrls: ['./cashback-setting-detail.component.scss']
})
export class CashbackSettingDetailComponent implements OnInit {
  code = null;
  data = null;

  columns = [
    {
      header: 'Player ID',
      field: 'username',
    },
    {
      header: 'Before Balance',
      field: 'beforeBalance',
      type: 'textNumber'
    },
    {
      header: 'Deposit',
      field: 'deposit',
    },

    {
      header: 'Withdraw',
      field: 'withdraw',
      type: 'textNumber'
    },
    {
      header: 'Receive Date',
      field: 'receiveDate',
      type: 'textCenter'
    },
    {
      header: 'Status',
      field: 'status',
    },
    {
      header: 'Current Balance',
      field: 'currentBalance',
    },
    {
      header: 'CashBack Code',
      field: 'cashbackCode',
    },
    {
      header: 'Received Amount',
      field: 'receiveAmount',
    },
  ];

  tr: any = [
    'username',
    'beforeBalance',
    'deposit',
    'withdraw',
    'receiveDate',
    'status',
    'currentBalance',
    // 'cashbackCode',
    'receiveAmount',
    'action',
  ];

  dataInput = [];


  columns2 = [
    { header: 'More Than Amount', field: 'moreThanAmount' },
    { header: 'Cashback Percent', field: 'cashbackPercent' },
    { header: 'Max Cashback Amount', field: 'maxCashbackAmount' }
  ];

  tr2: any = [
    'moreThanAmount',
    'cashbackPercent',
    'maxCashbackAmount'
  ];

  dataInput2 = [];

  constructor(private httpService: BaseService,
    private activeRoute: ActivatedRoute) {
    this.code = this.activeRoute.snapshot.queryParams.code;
    this.getOne(this.code);
  }

  ngOnInit(): void {
  }

  getOne(code) {
    this.httpService.doGet(URL.CASHBACK_DETAIL + '/' + code).subscribe(res => {
      if (res.status == "SUCCESS") {
        this.data = res.data; // temp
        this.dataInput = res.data.cashbackBatchWaitingList;
        this.dataInput2 = res.data.cashbackConditionResList;
      }
    })
  }

  goBack() {
    // this.router.navigate(['lotto-settings/lotto-yeekee']);
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
      if (row['status'] == 'WAITING' && row['tb.is_auto'] == "No") {
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
  doApproveAll() {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.CONFIRM, () => {
      this.httpService.doGet(`${URL.APPROVE_ALL}/${this.code}`).subscribe(res => {
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
  doRejectAll() {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.CONFIRM, () => {
      this.httpService.doGet(`${URL.REJECT_ALL}/${this.code}`).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })
  }

}
