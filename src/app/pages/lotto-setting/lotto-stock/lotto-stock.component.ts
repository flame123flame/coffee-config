import { element } from 'protractor';
import { ActionSetting, EditIcon } from './../../../models/ActionSettingModel';
import { BeanService } from './../../../service/BeanService.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PaginateFilter, PaginateRequest } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { LottoConstants } from './../lotto-constants/lotto-constants';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/service/message.service';
import Swal from 'sweetalert2';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { LottoRemarkComponent } from '../lotto-government/lotto-remark/lotto-remark.component';


const URL = {
  DELETE: '......',
  LOTTO_CLASS: 'lotto-class/get-lotto-class',
  GET_BY_CODE: 'add-lotto/get-lotto-time-by-code/',
  CHANGE_STATUS: 'add-lotto/change-status-lotto',
  SYNC_LOTTO_RESULT: 'lotto-result/sync-lotto-result'
};


class paginateData {
  id?: number;
  className: string;
  createStatus: string;
  viewStatus: string;
}
@Component({
  selector: 'app-lotto-stock',
  templateUrl: './lotto-stock.component.html',
  styleUrls: ['./lotto-stock.component.scss']
})
export class LottoStockComponent implements OnInit {

  columns: any = [
    { header: '#', field: 'id' },
    { header: 'Lotto Name', field: 'className', type: 'link' },
    { header: 'สถานะการสร้าง', field: 'createStatusStr' },
    { header: 'Message', field: 'closeMessage' },

  ];

  tr: any = [
    'className',
    'createStatusStr',
    'status-slide-toggle',
    'closeMessage',
    // 'status-slide-toggle',
    // 'status-slide-toggle',
    'action',
  ];

  actionSetting: ActionSetting = new ActionSetting({});

  data: any = [];
  dataBp: any = [];
  gameProviderList = [];
  productTypeList = [];
  gameGroupList = [];
  form: FormGroup;
  userRole = [];
  countInit = 0;

  constructor(
    private httpSer: BaseService,
    private httpBean: BeanService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.getCount();
    this.actionSetting.hideDetail = false;
    this.actionSetting.hideDelete = false;
    this.actionSetting.hideEdit = false;

    this.actionSetting.listIcon = [];
    const Icon1: EditIcon = new EditIcon();
    Icon1.icon = 'alarm';
    Icon1.color = '#86dbe3';
    Icon1.action = (data) => {
      this.editData(data);
    };
    this.actionSetting.listIcon.push(Icon1);
    const Icon6: EditIcon = new EditIcon();
    Icon6.icon = 'add_photo_alternate';
    Icon6.color = '#ff6edd';
    Icon6.tooltip = 'กติกา'
    Icon6.action = (data) => {
      this.addRules(data);
    };
    this.actionSetting.listIcon.push(Icon6);
    const Icon2: EditIcon = new EditIcon();
    Icon2.icon = 'attach_money';
    Icon2.color = '#8ae69e';
    Icon2.action = (data) => {
      this.getLottoGroup(data);
    };
    this.actionSetting.listIcon.push(Icon2);
    const Icon3: EditIcon = new EditIcon();
    Icon3.icon = 'forward_10';
    Icon3.color = '#3558e6';
    Icon3.action = (data) => {
      this.editLimitNumber(data);
    };
    this.actionSetting.listIcon.push(Icon3);
    const Icon4: EditIcon = new EditIcon();
    Icon4.icon = 'sync';
    Icon4.color = '#ffb703';
    Icon4.action = (data) => {
      this.getSyncLottoResult(data);
    };
    Icon4.showFunction = (data) => {
      let boo = false;
      this.userRole.forEach(element => {
        if (element == 'lottoApproveResult1')
          boo = true;
        {
        }
      });

      return boo;
    };
    this.actionSetting.listIcon.push(Icon4);
    const Icon5: EditIcon = new EditIcon();
    Icon5.icon = 'highlight_off';
    Icon5.color = '#ff1100';
    Icon5.action = (data) => {
      this.editCloseNumber(data)
    };
    this.actionSetting.listIcon.push(Icon5);
  }

  ngOnInit(): void {
    this.getLottoClass();
    this.getUserDetail();
  }

  checkStatus(status): string {
    return 'สำเร็จ';
  }

  getLottoClass() {
    this.httpBean.doGet(URL.LOTTO_CLASS + '/' + LottoConstants.LOTTO_STOCK).subscribe(res => {
      if (MessageService.MSG.SUCCESS === res.status) {
        res.data.forEach(element => {
          element.createStatusStr = this.checkStatus(element.createStatus);
          element.toggle = {};
          element.toggle.status = element.viewStatus == 'SHOW' ? true : false;
        });
        this.data = res.data;
        this.dataBp = res.data;
      }
    });
  }

  onCreatGroup() {
    this.router.navigate(['lotto-settings/lotto-government/lotto-government-add'],
      { queryParams: { category: LottoConstants.LOTTO_STOCK } });
  }

  getUserDetail() {
    this.httpSer.getUserDetail().subscribe(data => {

      data.data.role.forEach(element => {
        this.userRole.push(element.name);
      });
    });
  }

  addRules(data) {
    this.router.navigate(['lotto-settings/lotto-rules-add'],
      { queryParams: { classCode: data.lottoClassCode,className: data.className,prefix:data.prefixTransNumber} });
  }

  goDraftClass() {
    this.router.navigate(['lotto-settings/lotto-draft-class'],
      { queryParams: { category: LottoConstants.LOTTO_STOCK } });
  }

  editData(data) {
    this.router.navigate(['lotto-settings/lotto-government/lotto-government-add'],
      { queryParams: { lottoClassCode: data.lottoClassCode, category: LottoConstants.LOTTO_STOCK } });
  }

  editLimitNumber(data) {
    this.router.navigate(['lotto-settings/lotto-government/limit-number'],
      { queryParams: { lottoClassCode: data.lottoClassCode, lottoClassName: data.className, category: LottoConstants.LOTTO_STOCK } });
  }

  editCloseNumber(data) {
    this.router.navigate(['lotto-settings/lotto-government/close-number'],
      { queryParams: { lottoClassCode: data.lottoClassCode, lottoClassName: data.className, category: LottoConstants.LOTTO_STOCK } });
  }

  getCount() {
    this.httpBean.doGet('draft-lotto-class/get-count-init/' + LottoConstants.LOTTO_STOCK)
      .subscribe((res) => {
        this.countInit = res?.data ?? 0;
      });
  }

  changeStatus(event, id) {
    console.log(event, id);
    console.log(this.data);
    let status;
    if (event === 'SHOW') {
      // กดปิด
      status = false;

      let remark = '';
      const dialogRef = this.dialog.open(LottoRemarkComponent, {
        width: '250px',
        data: { remark }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result) {
          this.callChangeStatus(status, id, result);
        } else {
          setTimeout(() => {
            this.data = [];
            setTimeout(() => {
              this.data = this.dataBp;
            }, 10);
          }, 10);
        }
      });
    }
    else {
      // กดเปิด
      status = true;
      DialogSweetAlertService.opentModalSweetAlertConfirm(
        'ยืนยันการทำรายการ',
        'คุณต้องการเปิดใช้หวยนี้ ?',
        () => {
          this.callChangeStatus(status, id, null);
        },
        () => {
          setTimeout(() => {
            this.data = [];
            setTimeout(() => {
              this.data = this.dataBp;
            }, 10);
          }, 10);
        });
    }
  }

  callChangeStatus(status, id, remark) {
    this.httpBean.doPost(`${URL.CHANGE_STATUS}/${status}/${id}`, { remark }).subscribe(res => {
      this.getLottoClass();
    });
  }

  onDelete(data) {
    this.httpBean.doDelete(URL.DELETE + data.lottoClassCode).subscribe(res => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.getLottoClass();
      }
    });
  }

  getLottoGroup(data) {

    this.router.navigate(['lotto-settings/lotto-government/lotto-config'],
      { queryParams: { classCode: data.lottoClassCode, className: data.className, category: LottoConstants.LOTTO_STOCK } });
  }

  getSyncLottoResult($event) {
    this.router.navigate(['lotto-settings/lotto-result-add'],
      { queryParams: { classCode: $event.lottoClassCode, className: $event.className } });
    // this.httpBean.doGet(`${URL.SYNC_LOTTO_RESULT}?lottoClassCode=${$event.lottoClassCode}`).subscribe(res => {
    //   if (MessageService.MSG.SUCCESS === res.status) {
    //     // this.getLottoClass();
    //   }
    // });
  }

}
