import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BeanService } from 'src/app/service/BeanService.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LottoGovernmentCloseNumberDialogComponent } from './lotto-government-close-number-dialog/lotto-government-close-number-dialog.component';
import * as moment from 'moment';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';

const URL = {
  CLOSE_NUMBER: 'close-number/get-close-number',
  CHANG_STATUS: 'close-number',
  CLOSE_DELETE: 'close-number/delete-close-number',
  GET_MSD: 'msd-lotto-kind/get-by-class-code-in'
};
class table {
  id?: number = null;
  lottoNumber: number = null;
  lottoPrice: string = null;
  createdAt: string = null;
  createdBy: string = null;
  updatedAt: string = null;
  updatedBy: string = null;
  lottoGroupDtlCode: string = null;
  swappedGroupCode: string;
  toggle: toggle = new toggle();
}
class toggle {
  status = false;
  disabled = false;
  action: any;
}

@Component({
  selector: 'app-lotto-government-close-number',
  templateUrl: './lotto-government-close-number.component.html',
  styleUrls: ['./lotto-government-close-number.component.scss']
})
export class LottoGovernmentCloseNumberComponent implements OnInit {

  columns = [
    { header: 'Lotto Number', field: 'lottoNumber' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Created At', field: 'createdAt' },
    { header: 'Last Updated By', field: 'updatedBy' },
    { header: 'Last Updated At', field: 'updatedAt' },
  ];
  tr: any = [
    'lottoNumber',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'status-slide-toggle',
    'action',
  ];

  actionSetting: ActionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: true,
    hideDetail: false,
  });
  lottoClassCode: string;
  className: string;

  msdList = [];
  msdDataList = {};
  NODATA_MESSAGE = 'NO DATA';

  constructor(
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private beanSer: BeanService,
    private router: Router,
    private _location: Location,) {
    activateRoute.queryParams.subscribe(param => {
      this.lottoClassCode = param.lottoClassCode;
      this.className = param.lottoClassName;
      this.getMSD(this.lottoClassCode);
    });
  }

  ngOnInit(): void {
  }

  addNumber(kind = null, name, data?) {
    this.openDialogGames({
      lottoClass: this.lottoClassCode,
      lottoKind: kind,
      kindName: name,
      data,
    });
  }

  openDialogGames(data = null, http = 'post'): void {
    const dataIn = {};
    if (data) {
      dataIn['data'] = data;
    }
    dataIn['http'] = http;
    const dialogRef = this.dialog.open(LottoGovernmentCloseNumberDialogComponent, { data: dataIn, width: '600px' });
    dialogRef.afterClosed().subscribe(result => {
      this.initPage();
    });
  }



  log(e) {
    console.log(e);
  }

  initPage() {
    this.msdList.forEach(element => {
      this.getLottoList(element.msdLottoKindCode);
    });
  }

  closNumberList = []
  async getLottoList(kind = null) {
    this.closNumberList = [];
    await this.beanSer.doGet(`${URL.CLOSE_NUMBER}/${kind}/${this.lottoClassCode}`).subscribe(data => {

      if (data.status == 'SUCCESS') {
        this.closNumberList.push(data.data)
        console.log(this.closNumberList);
        const list: table[] = [];

        if (kind === '3DIGIT_SWAPPED') {
          let dataSet = [];
          data.data.forEach(element => {
            let isHasInNew = false;
            dataSet.forEach(newList => {
              if (element?.swappedGroupCode == newList.swappedGroupCode) {
                newList.lottoNumber = newList.lottoNumber + ',' + element.lottoNumber;
                isHasInNew = true;
              }
            });
            if (!isHasInNew) {
              dataSet.push(element);
            }
          });
          if (dataSet)
            data.data = dataSet;
        }
        data.data.forEach(element => {
          const listItem: table = new table();
          listItem.id = element.closeNumberId;
          listItem.lottoNumber = element.lottoNumber;
          listItem.toggle.status = element.enable;
          listItem.createdAt = moment(element.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            listItem.createdBy = element.createdBy;
          listItem.updatedAt = !element.updatedAt ? '' : moment(element.updatedAt).format('DD/MM/YYYY HH:mm:ss');
          listItem.updatedBy = element?.updatedBy;
          listItem.swappedGroupCode = element?.swappedGroupCode;
          list.push(listItem);
        });
        this.msdDataList[kind] = list;
      }

    });
  }

  deleteOne(event: table) {
    let param = '';
    if (event.swappedGroupCode) {
      param = '?swappedGroupCode=' + event.swappedGroupCode;
    }
    DialogSweetAlertService.opentModalSweetAlertConfirm('ยืนยันการลบข้อมูล', 'คุณต้องการยืนยันลบข้อมูลนี้หรือไม่', () => {
      this.beanSer.doDelete(`${URL.CLOSE_DELETE}/${event.id}/${this.lottoClassCode}${param}`).subscribe(data => {

        if (data.status == 'SUCCESS') {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', data.message);
          this.initPage();
        }
        else {
          DialogSweetAlertService.opentModalSweetAlertError('', data.message)
        }
      });
    });

  }

  setEnable(bool, event) {
    let param = '';
    if (event.swappedGroupCode) {
      param = '?swappedGroupCode=' + event.swappedGroupCode;
    }
    this.beanSer.doGet(`${URL.CHANG_STATUS}/setEnable/${event.id}/${bool}/${this.lottoClassCode}${param}`)
      .subscribe(data => {
        this.initPage();
      });
  }

  getMSD(code) {
    this.beanSer.doGet(`${URL.GET_MSD}/${code}`).subscribe(data => {
      console.log(code);
      if (data.status == 'SUCCESS') {
        this.msdList = data.data;
        this.msdList.forEach(element => {
          this.getLottoList(element.msdLottoKindCode);
        });
      }

    });
  }
  goBack() {
    this._location.back();
  }

}
