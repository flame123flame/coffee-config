import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { LottoConfigDialogConfirmComponent } from './lotto-config-dialog-confirm/lotto-config-dialog-confirm.component';
import { PrizeList } from '../lotto-config-add-prize/lotto-config-add-prize.component';
import { Location } from '@angular/common';
import { LottoConstants } from '../lotto-constants/lotto-constants';

const URL = {
  VIP_PRIZE: 'group-risk2/get-group-risk-vip-prize-setting',
  // GET_MSD: 'msd-lotto-kind/get-by-class-code-in'
}
@Component({
  selector: 'app-lotto-config',
  templateUrl: './lotto-config.component.html',
  styleUrls: ['./lotto-config.component.scss']
})
export class LottoConfigComponent implements OnInit {
  columns: any = [
    { header: 'VIP', field: 'vipName' },
    { header: 'จำนวนซื้อขั้นต่ำต่อเลขต่อโพย (฿)', field: 'minimumPerTrans', type: 'pipeNumber' },
    { header: 'จำนวนซื้อสูงสุดต่อเลขต่อโพย (฿)', field: 'maximumPerTrans', type: 'pipeNumber' },
    { header: 'จำนวนซื้อสูงสุดต่อเลขต่อ username (฿)', field: 'maximumPerUser', type: 'pipeNumber' },
    // { header: 'Percent for Limit', field: 'percentForLimit', type: 'number' },

  ];
  tr: any = [
    'vipName',
    'minimumPerTrans',
    'maximumPerTrans',
    'maximumPerUser',
    // 'percentForLimit',
    // 'action',
  ];

  columns1: any = [
    { header: 'VIP', field: 'vipName' },

  ];
  tr1: any = [
    'vipName',
    'DEFAULT',
    // 'action',
  ];

  title: '';
  lottoClassCode: '';
  groupCode: '';
  groupRiskData = [];
  groupLevelList = [];

  // view: data table
  lottoMaxMinList = [];
  lottoGroupList = [];
  category
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private httpBaseService: BaseService,
    private _location: Location
  ) { }

  ngOnInit(): void {

    this.category = this.routeParam.snapshot.queryParams.lottoCategoryCode;
    if(!this.routeParam.snapshot.queryParams.lottoCategoryCode)
    {
      this.category = this.routeParam.snapshot.queryParams.category;
    }

    this.routeParam.queryParams.subscribe(data => {
      console.log(data);
      if (data) {
        this.title = data.className;
        this.lottoClassCode = data.classCode;
        console.log(data.classCode);
      }
    });
    this.getGroupLevel();

    console.log(this.lottoMaxMinList);
  }

  onClickAdd($event) {
    console.log($event);
    console.log(this.lottoClassCode);
    console.log(this.title);
    this.router.navigate(['lotto-settings/lotto-government/lotto-config/add-group'],
      { queryParams: { classCode: this.lottoClassCode, groupCode: null, className: this.title } });
  }

  onClickEditRiskGroup(index) {
    console.log(this.groupRiskData[index].groupCode);
    console.log(index);
    this.router.navigate(['lotto-settings/lotto-government/lotto-config/add-group'],
      { queryParams: { classCode: this.lottoClassCode, groupCode: this.groupRiskData[index].groupCode, className: this.title } }
    );
  }

  onClickEditMinMax(kindCode, kindName, index) {
    console.log(kindCode);
    this.router.navigate(['lotto-settings/lotto-government/lotto-config/add-max-min'],
      { queryParams: { classCode: this.lottoClassCode, msdLottoKindCode: kindCode, className: this.title, msdLottoKindName: kindName, groupCode: this.groupRiskData[index].groupCode } }
    );
  }

  onClickEditPrize(index, kindCode, kindName) {
    console.log(index);
    this.router.navigate(['lotto-settings/lotto-government/lotto-config/add-prize'],
      { queryParams: { classCode: this.lottoClassCode, groupCode: this.groupRiskData[index].groupCode, className: this.title, msdLottoKindCode: kindCode, msdLottoKindName: kindName } }
    );
  }

  onClickDeleteGroup(groupCode) {

    const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'DELETE') {
        // delete
        this.httpBeanService.doDelete('group-risk2/delete-lotto-group-risk/' + groupCode).subscribe(res => {
          console.log(res);
          if (res.status === 'SUCCESS') {
            console.log("delete Group!!!");
            this.getGroupRisk();
          }
        });

        // loading list when deleted

      }
    });
  }

  getOnDraftConfig() {
    this.router.navigate(['lotto-settings/lotto-government/lotto-config/lotto-draft-config']);
  }

  //  not success
  onClickDeleteKind(kindCode, groupCode) {
    console.log(kindCode);
    console.log(groupCode);
    const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'DELETE') {
        // delete
        this.httpBeanService.doDelete('group-risk2/delete-group-risk/' + kindCode + '/' + groupCode + '/' + this.lottoClassCode).subscribe(res => {
          console.log(res);
          if (res.status === 'SUCCESS') {
            // this.router.navigate(['lotto-settings/lotto-government/lotto-config/'],
            //   { queryParams: { classCode: this.lottoClassCode, groupCode: null, className: this.title } }
            // );
            console.log("delete Risk!!!");
            this.getGroupRisk();
          }
        });

        // loading list when deleted

      }
    });
  }

  // loading list
  getGroupRisk() {
    this.httpBeanService.doPost('group-risk2/get-by-class/' + this.lottoClassCode, null).subscribe(res => {
      this.groupRiskData = res.data;

      this.groupRiskData.forEach(element1 => {
        element1['groupRiskList'].forEach(groupRisk => {
          groupRisk['minmax'].forEach(minMax => {
            this.groupLevelList.forEach(vip => {
              if (minMax['vipCode'] === vip['groupCode']) {
                minMax.vipName = vip['groupName'];
              }
              else if (minMax['vipCode'] === 'DEFAULT') {
                minMax.vipName = 'DEFAULT';
              }
            });
          });
        });
      });
      console.log(this.groupRiskData);

    });
  }

  getGroupLevel() {
    this.httpBaseService.doGet('groupLevel/get-dropdown-group').subscribe(res => {
      this.groupLevelList = res.data;
      this.getGroupRisk();
    });
  }

  getRowAndColList(prize, kindCode) {
    // console.log(this.groupLevelList);
    const DATA = [];
    prize.forEach(data => {
      // console.log(data['vipCode']);
      const tmp = this.groupLevelList.find(vip => vip['groupCode'] === data['vipCode']);
      if (tmp !== undefined && data['vipCode'] !== 'DEFAULT') {
        DATA.push({
          vipCode: data['vipCode'],
          vipName: tmp['groupName'],
        });
      }
      else if (tmp === undefined && data['vipCode'] === 'DEFAULT') {
        DATA.push({
          vipCode: data['vipCode'],
          vipName: 'DEFAULT',
        });
      }

      data.prizeList.forEach((element, i) => {
        DATA.forEach(DATA => {
          if (data.vipCode === DATA.vipCode) {
            DATA['col' + i] = element.prize;
          }
        });
      });

    });
    // console.log(DATA);
    return DATA;
  }

  createTr(prizeList) {
    const TR = ['vipName'];
    prizeList.forEach((data, i) => {
      TR.push(
        'col' + i
      );
    });
    return TR;
  }

  createColumns(prizeList) {
    const COLUMN = [
      { header: 'VIP', field: 'vipName', type: null },
    ];
    prizeList.forEach((data, i) => {

      COLUMN.push(
        {
          header: data.percentForLimit + '%',
          field: 'col' + i,
          type: 'pipeNumber'
        },
      );
    });
    return COLUMN;
  }

  goBack() {
      if (this.category == LottoConstants.LOTTO_GOVERNMENT) {
        this.router.navigate(['lotto-settings/lotto-government']);
      } else if (this.category == LottoConstants.LOTTO_STOCK) {
        this.router.navigate(['lotto-settings/lotto-stock']);
      }
    }
}
