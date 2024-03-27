import { MessageService } from './../../../service/message.service';
import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuDropdownItem } from 'src/app/models/MenuDropdownItem';
import { PaginateRequest } from 'src/app/models/PaginateRequest';
import * as moment from 'moment';
import { ActionSetting } from 'src/app/models/ActionSettingModel';

const URL = {
  PAGINATE: 'rebate/paginate',
  TEST_REBATE: 'cashback/test-rebate',
  TEST_REBATE2: 'cashback/test-rebate2',
  REBATE: 'rebate'
}

class dataTable {
  code: String;
  title: String;
  product_type: String;
  effective_date: String;
  auto_rebate: String;
  rebateTerms: String;
  maxRebate: String;
  status: String;
  lastUpdate: String;
  updateBy: String;
  data: any;
}
@Component({
  selector: 'app-rebate-setting-new',
  templateUrl: './rebate-setting-new.component.html',
  styleUrls: ['./rebate-setting-new.component.scss'],
})
export class RebateSettingNewComponent implements OnInit {
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add',
      onClick: () => {
        this.router.navigate(['rebate-management/rebate-setting-new-add']);
      },
    },
  ];
  columns: any = [
    { header: 'Rebate Title', field: 'title' },
    { header: 'Product Type', field: 'product_type' },
    { header: 'Effective Date', field: 'effective_date', type: 'textCenter' },
    { header: 'Auto Rebate', field: 'auto_rebate' },
    { header: 'Rebate Terms', field: 'rebateTerms' },
    { header: 'Max. Group Rebate', field: 'maxRebate', type: 'textNumber' },
    { header: 'Status', field: 'status', type: 'textCenter' },
    { header: 'Last Update', field: 'lastUpdate', type: 'textCenter' },
    { header: 'Update By', field: 'updateBy', type: 'textCenter' },
  ];

  tr: any = [
    'title',
    'product_type',
    'effective_date',
    'auto_rebate',
    'rebateTerms',
    'maxRebate',
    'status',
    'lastUpdate',
    'updateBy',
    'action'
  ];
  dataInput: any = [
  ];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';
  actionSetting = new ActionSetting({
    hideEdit: true,
    hideDelete: true,
  });
  constructor(private router: Router,
    private httpService: BaseService) { }

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    let arr = []
    this.httpService.doPost(URL.PAGINATE, this.createParam()).subscribe(data => {
      if (data.status == "SUCCESS") {
        data.data.data.forEach(element => {
          let one: dataTable = new dataTable();
          one.code = element.code
          one.title = element.title
          one.product_type = element.productTypeCode;
          one.effective_date = moment(element.startDate).format('DD/MM/YYYY HH:mm:ss')
          one.auto_rebate = element.isAutoRebate != false ? 'YES' : 'NO';
          one.rebateTerms = this.periodStatusConvert(element.periodStatus)
          one.maxRebate = element.maxGroupRebate
          one.status = element.status != false ? 'ACTIVE' : 'DISABLE'
          one.lastUpdate = element.updatedDate != null ? moment(element.updatedDate).format('DD/MM/YYYY HH:mm:ss') : ''
          one.updateBy = element.updatedBy
          one.data = element
          arr.push(one);
        });
        this.dataInput = arr
      }
    })
  }

  createParam() {
    let param: PaginateRequest = new PaginateRequest();
    param.length = 10
    param.page = 0
    param.sort = []
    param.filter = []
    return param
  }

  periodStatusConvert(num) {
    if (num == 1) {
      return 'Daily'
    } else if (num == 2) {
      return 'Weekly'
    } else if (num == 3) {
      return 'Mount'
    }
  }

  clickEdit(event) {
    this.router.navigate(['rebate-management/rebate-setting-new-add'], {
      queryParams: {
        code: event.data.code
      }
    })
  }

  clickDelete(event) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.httpService.doDelete(`${URL.REBATE}/${event.data.code}`).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.loadList();
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })

  }

  testRebate() {
    this.httpService.doGet(URL.TEST_REBATE).subscribe(res => {
      if (res.status === MessageService.MSG.SUCCESS) {
        alert(res.message)
      } else {
        alert(res.message)

      }
    })
  }
  testRebate2() {
    this.httpService.doGet(URL.TEST_REBATE2).subscribe(res => {
      if (res.status === MessageService.MSG.SUCCESS) {
        alert(res.message)
      } else {
        alert(res.message)

      }
    })
  }
}
