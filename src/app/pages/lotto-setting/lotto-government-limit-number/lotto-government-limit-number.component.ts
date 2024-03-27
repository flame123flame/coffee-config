import { LottoGovernmentLimitNumberDialogComponent } from './lotto-government-limit-number-dialog/lotto-government-limit-number-dialog.component';
import { ActionSetting } from './../../../models/ActionSettingModel';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BeanService } from 'src/app/service/BeanService.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
const URL = {
  LIMIT_NUMBER: 'limit-number',
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
  toggle: toggle = new toggle();
}
class toggle {
  status = false;
  disabled = false;
  action: any;
}

@Component({
  selector: 'app-lotto-government-limit-number',
  templateUrl: './lotto-government-limit-number.component.html',
  styleUrls: ['./lotto-government-limit-number.component.scss']
})
export class LottoGovernmentLimitNumberComponent implements OnInit {

  columns = [
    { header: 'Lotto Number', field: 'lottoNumber' },
    { header: 'Lotto Price', field: 'lottoPrice' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Created At', field: 'createdAt' },
    { header: 'Last Updated By', field: 'updatedBy' },
    { header: 'Last Updated At', field: 'updatedAt' },
  ];
  tr: any = [
    'lottoNumber',
    'lottoPrice',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'status-slide-toggle',
    'action',
  ];

  actionSetting: ActionSetting = new ActionSetting({});
  lottoClassCode: string;
  className: string;

  msdList = [];
  msdDataList = {};
  NODATA_MESSAGE = 'NO DATA';

  constructor(public dialog: MatDialog,
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
    let lottoNumber;
    if (kind == '3DIGIT_SWAPPED' && data?.lottoNumber) {
      lottoNumber = data.lottoNumber.split(",")[0]
    }
    this.openDialogGames({
      lottoClass: this.lottoClassCode,
      lottoKind: kind,
      kindName: name,
      data: { ...data, lottoNumber },
    });
  }

  openDialogGames(data = null, http = 'post'): void {
    const dataIn = {};
    if (data) {
      dataIn['data'] = data;
    }
    dataIn['http'] = http;
    const dialogRef = this.dialog.open(LottoGovernmentLimitNumberDialogComponent, { data: dataIn, width: '600px' });
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


  async getLottoList(kind = null) {
    await this.beanSer.doGet(`${URL.LIMIT_NUMBER}?kind=${kind}&classCode=${this.lottoClassCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
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
          listItem.id = element.limitNumberId;
          listItem.lottoNumber = element.lottoNumber;
          listItem.lottoPrice = `LEVEL ${element.tierLevel} | ${element.prize}`;
          listItem.toggle.status = element.enable;
          listItem.createdAt = element.createdAt;
          listItem.createdBy = element.createdBy;
          listItem.updatedAt = element?.updatedAt;
          listItem.updatedBy = element?.updatedBy;
          listItem.lottoGroupDtlCode = element?.lottoGroupDtlCode;
          list.push(listItem);
        });
        this.msdDataList[kind] = list;
      }

    });
  }

  deleteOne(id) {
    this.beanSer.doDelete(`${URL.LIMIT_NUMBER}/${id}/${this.lottoClassCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        alert('DELETE SUCCESS');
        this.initPage();
      }
    });
  }

  setEnable(bool, id) {
    this.beanSer.doGet(`${URL.LIMIT_NUMBER}/setEnable/${id}/${bool}/${this.lottoClassCode}`).subscribe(data => {
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
