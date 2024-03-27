import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting, EditIcon } from 'src/app/models/ActionSettingModel';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
import { LottoConstants } from '../lotto-constants/lotto-constants';
import { LottoRemarkComponent } from '../lotto-government/lotto-remark/lotto-remark.component';

const URL = {
  DELETE: '......',
  LOTTO_CLASS: 'lotto-class/get-lotto-class',
  CHANGE_STATUS: 'add-lotto/change-status-lotto',
};

@Component({
  selector: 'app-lotto-yiki',
  templateUrl: './lotto-yiki.component.html',
  styleUrls: ['./lotto-yiki.component.scss']
})
export class LottoYikiComponent implements OnInit {

  columns: any = [
    { header: '#', field: 'id' },
    { header: 'Lotto Name', field: 'className', type: 'link' },
    { header: 'สถานะการสร้าง', field: 'createStatusStr' },
    { header: 'Message', field: 'closeMessage' },

  ];

  data: any = [];
  dataBp: any = [];

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

  constructor(
    private router: Router,
    private httpService: BaseService,
    private httpBean: BeanService,
    private activateRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    
  ) {

    this.actionSetting.hideDetail = false;
    this.actionSetting.hideDelete = false;
    this.actionSetting.hideEdit = false;

    this.actionSetting.listIcon = [];
    const Icon1: EditIcon = new EditIcon();
    Icon1.icon = 'alarm';
    Icon1.color = '#86dbe3';
    Icon1.tooltip ='แก้ไข '
    Icon1.action = (data) => {
      this.editData(data);
    };
    this.actionSetting.listIcon.push(Icon1);
    
    const Icon5: EditIcon = new EditIcon();
    Icon5.icon = 'attach_money';
    Icon5.icon = 'add_photo_alternate';
    Icon5.color = '#ff6edd';
    Icon5.action = (data) => {
      this.addRules(data);
    };
    this.actionSetting.listIcon.push(Icon5);
    const Icon2: EditIcon = new EditIcon();
    Icon2.icon = 'attach_money';
    Icon2.color = '#8ae69e';
    Icon2.tooltip ='เพิ่ม ราคา'
    Icon2.action = (data) => {
      this.addYeekeePrize(data);
      console.log(data)
    };
    this.actionSetting.listIcon.push(Icon2);
    const Icon3: EditIcon = new EditIcon();
    Icon3.icon = 'poll';
    Icon3.color = '#2146eb';
    Icon3.tooltip ='เพิ่ม Max Min'
    Icon3.action = (data) => {
      this.addYeekeeMaxmin(data);
    };
    this.actionSetting.listIcon.push(Icon3);
    const Icon4: EditIcon = new EditIcon();
    Icon4.icon = 'emoji_events';
    Icon4.color = '#fab005';
    Icon4.tooltip ='เพิ่ม ลำดับรางวัล'
    Icon4.action = (data) => {
      this.seqWinData(data);
    };
    this.actionSetting.listIcon.push(Icon4);

    // const Icon5: EditIcon = new EditIcon();
    // Icon5.icon = 'group_add';
    // Icon5.color = '#000000';
    // Icon5.tooltip ='เพิ่ม Dummy'
    // Icon5.action = (data) => {
    //   this.addDummy(data);
    // };
    // this.actionSetting.listIcon.push(Icon5);

  }

  

  ngOnInit(): void {
    this.getLottoClass()
  }

  addLottoYeekee() {
    this.router.navigate(['lotto-settings/lotto-yeekee/lotto-yeekee-add']);
  }

  checkStatus(status): string {
    return 'สำเร็จ';
  }

  addYeekeePrize(data)
  {
    this.router.navigate(['lotto-settings/lotto-yeekee/lotto-yeekee-add-prize'],
    { queryParams: { classCode: data.lottoClassCode, className: data.className, category: LottoConstants.LOTTO_YEEKEE } });
  }

  addRules(data)
  {
    this.router.navigate(['lotto-settings/lotto-rules-add'],
    { queryParams: { classCode: data.lottoClassCode, className: data.className,prefix:data.prefixTransNumber} });
  }

  addYeekeeMaxmin(data)
  {
    this.router.navigate(['lotto-settings/lotto-yeekee/lotto-yeekee-add-max-min'],
    { queryParams: { classCode: data.lottoClassCode, className: data.className, category: LottoConstants.LOTTO_YEEKEE } });
  }

  getLottoClass() {
    this.httpBean.doGet(URL.LOTTO_CLASS + '/' + LottoConstants.LOTTO_YEEKEE).subscribe(res => {
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

  editData(data) {
    this.router.navigate(['lotto-settings/lotto-yeekee/lotto-yeekee-add'],
      { queryParams: { lottoClassCode: data.lottoClassCode, category: LottoConstants.LOTTO_YEEKEE ,lottoClassId:data.lottoClassId} });
  }

  seqWinData(data) {
    this.router.navigate(['lotto-settings/lotto-yeekee/lotto-yeekee-add-seq-win-prize'],
      { queryParams: { lottoClassCode: data.lottoClassCode, category: LottoConstants.LOTTO_YEEKEE ,lottoClassId:data.lottoClassId ,className: data.className} });
  }

  addDummy(data){
    this.router.navigate(['lotto-settings/lotto-yeekee/lotto-yeekee-add-dummy-user'],
    // { queryParams: { lottoClassCode: data.lottoClassCode, category: LottoConstants.LOTTO_YEEKEE ,lottoClassId:data.lottoClassId ,className: data.className} });
    { queryParams: { lottoClassCode: null, category: LottoConstants.LOTTO_YEEKEE ,lottoClassId:null ,className: null} });
  }

  

}
