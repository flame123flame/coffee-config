import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { MenuDropdownItem } from 'src/app/models/MenuDropdownItem';
import { PaginateRequest } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';

const URL = {
  PAGINATE: 'cashback/paginate',
  CASHBACK: 'cashback',
  TEST1: 'cashback/test-cashback',
  TEST2: 'cashback/test-cashback2',
}
class dataTable {
  code: String
  title: String;
  product_type: String;
  effective_date: String;
  auto_cashback: String;
  cashbackTerms: String;
  maxCashback: String;
  status: String;
  lastUpdate: String;
  updateBy: String;
  data: any;
}
@Component({
  selector: 'app-cashback-setting-new',
  templateUrl: './cashback-setting-new.component.html',
  styleUrls: ['./cashback-setting-new.component.scss']
})
export class CashbackSettingNewComponent implements OnInit {
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add',
      onClick: () => {
        this.router.navigate(['cashback-management/cashback-setting-new-add']);
      },
    },
  ];
  columns: any = [
    { header: 'Cashback Title', field: 'title' },
    { header: 'Effective Date', field: 'effective_date', type: 'textCenter' },
    { header: 'Auto Cashback', field: 'auto_cashback' },
    { header: 'Cashback Terms', field: 'cashbackTerms' },
    { header: 'Status', field: 'status', type: 'textCenter' },
    { header: 'Last Update', field: 'lastUpdate', type: 'textCenter' },
    { header: 'Update By', field: 'updateBy', type: 'textCenter' },
  ];

  tr: any = [
    'title',
    'effective_date',
    'auto_cashback',
    'cashbackTerms',
    'status',
    'lastUpdate',
    'updateBy',
    'action'
  ];
  dataInput = [];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';

  actionSetting = new ActionSetting({
    hideEdit: true,
    hideDelete: true,
    // hideDetail: true,
  })

  constructor(private router: Router,
    private httpService: BaseService) { }

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    let arr = [];
    this.httpService.doPost(URL.PAGINATE, this.createParam()).subscribe(data => {
      console.log(data);
      if (data.status == "SUCCESS") {
        data.data.data.forEach(element => {
          let one: dataTable = new dataTable();
          one.code = element.code;
          one.title = element.title;
          one.effective_date = moment(element.startDate).format('DD/MM/YYYY HH:mm:ss');
          one.auto_cashback = element.isAutoRebate != false ? 'YES' : 'NO';
          one.cashbackTerms = this.periodStatusConvert(element.periodStatus);
          one.status = element.status != false ? 'ACTIVE' : 'DISABLE';
          one.lastUpdate = element.updatedDate != null ? moment(element.updatedDate).format('DD/MM/YYYY HH:mm:ss') : ''
          one.updateBy = element.updatedBy;
          one.data = element;
          arr.push(one);
        });
        this.dataInput = arr;
      }
    })
  }

  createParam() {
    let param: PaginateRequest = new PaginateRequest();
    param.length = 10;
    param.page = 0;
    param.sort = [];
    param.filter = [];
    return param;
  }

  periodStatusConvert(num) {
    if (num == 1) {
      return 'Daily';
    } else if (num == 2) {
      return 'Weekly';
    } else if (num == 3) {
      return 'Mount';
    }
  }

  clickEdit(event) {
    this.router.navigate(['cashback-management/cashback-setting-new-add'], {
      queryParams: {
        code: event.data.code,
        id: event.data.id
      }
    })
  }

  clickDelete(event) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.httpService.doDelete(`${URL.CASHBACK}/${event.data.code}`).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.loadList();
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })
  }
  clickTest1() {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', "CONFIRM", () => {
      this.httpService.doGet(`${URL.TEST1}`).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.loadList();
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })
  }
  clickTest2() {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', "CONFIRM", () => {
      this.httpService.doGet(`${URL.TEST2}`).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.loadList();
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })
  }

  viewDetail(event) {
    this.router.navigate(['cashback-management/cashback-setting-detail'], {
      queryParams: {
        code: event.code
      }
    });
  }
}
