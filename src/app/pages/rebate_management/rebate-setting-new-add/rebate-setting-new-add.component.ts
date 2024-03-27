import { RebateSettingNewAddDialogComponent } from './rebate-setting-new-add-dialog/rebate-setting-new-add-dialog.component';
import { group } from '@angular/animations';
import { BaseService } from './../../../service/BaseService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { PeriodicElement } from '../../casino_settings/product-maintenance/product-maintenance.component';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
import { MatDatePickerService } from 'src/app/service/MatDatePickerService.service';

const URL = {
  PRODUCT_TYPE: "game-product-type",
  TAG_MANAGEMENT: "tag-management",
  GROUP_GAME: "game-group",
  GAME: "games",
  GROUP_LEVEL: "groupLevel/getAllGroupLevel",
  REBATE: "rebate",
  GET_GAME_BY_PRODUCT_TYPE: 'games/get-games-by-product-type/',
};

export interface GameProviderRes {
  id: number;
  nameTh: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  nameEn: string;
  code: string;
}

export interface GamesRes {
  id?: number;
  nameTh: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  nameEn: string;
  code: string;
  gameProductTypeCode: string;
  providerCode: string;
  platformMapp: boolean;
  platformMhFive: boolean;
  platformMini: boolean;
  minRtp: number;
  maxRtp: number;
  gameTag: string;
  displayName: string;
  status: boolean;
  remark: string;
  gameCode: string;
  gameGroupCode: string;
  platformPcDl: boolean;
  platformPc: boolean;
  enable: boolean;
  gameProviderNameEn: string;
  gameGroupNameEn: string;
}

export interface GameGroupRes {
  id: number;
  nameTh: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  nameEn: string;
  code: string;
  gameProductTypeCode: string;
  gameProductTypeRes?: any;
  gamesRes: GamesRes[];
}

export interface productTypeRes {
  id?: any;
  nameTh?: any;
  createdAt?: any;
  updatedAt?: any;
  updatedBy?: any;
  nameEn?: any;
  code: string;
  gameProviderCode: string;
  gameProviderNameEn: string;
  gameGroupNameEn: string;
}

class table {
  id?: number = null;
  gameProvider: string = null;
  gameProviderCode: string = null;
  gameGroupCode: string = null;
  validBets: number = null;
  rebatePercent: number = null;
  rebateMax: number = null;
  games: childGame[] = [];
}

class childGame {
  id?: number = null;
  name: string = null;
  gameCode: string = null;
  status: boolean = null;
  rtp: number = null;
  isExclude: boolean = false;
  validBets: number = null;
  rebatePercent: number = null;
  rebateMax: number = null;
}

class rebateCondition {
  id?: number;
  rebatePercent: number;
  maxRebate: number;
  validBets: number;
  gameProviderCode: string;
  gameGroupCode: string;
}

class sendData {
  id?: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  periodStatus: string;
  rebateType: string;
  isAutoRebate: boolean;
  status: boolean;
  vipGroupCode: string;
  productTypeCode: string;
  maxGroupRebate: string;
  tagCode: string;
  gamesCodeExclude: string;
  rebateConditionMultiplier: number;
  rebateConditionList: rebateCondition[];
}
export interface resData {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  periodStatus: number;
  rebateType: number;
  isAutoRebate: boolean;
  status: boolean;
  vipGroupCode: string;
  productTypeCode: string;
  maxGroupRebate: number;
  createdDate: Date;
  updatedDate: Date;
  updatedBy: string;
  code: string;
  tagCode: string;
  gameGroupCode: string;
  gamesCodeExclude: string;
  rebateConditionMultiplier: number;
  gameProductTypeRes?: any;
  tagManagement: TagManagement;
  rebateConditionResList: RebateConditionResList[];
  groupLevelRes: GroupLevelRes;
}

interface TagManagement {
  id: number;
  name: string;
  description: string;
  remark: string;
  totalPlayers: number;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  tagCode: string;
}

interface RebateConditionResList {
  id: number;
  code: string;
  rebateCode: string;
  rebatePercent?: number;
  maxRebate?: number;
  validBets?: number;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
  gameProviderCode: string;
  gameGroupCode: string;
  gameProviderRes: GameProviderRes;
  gameGroupRes: GameGroupRes;
}

export interface GroupLevelRes {
  id: number;
  groupCode: string;
  groupName: string;
  countPlayer: number;
  status: string;
  description: string;
  showInFrontEnd: boolean;
  totalDepositAmtUp: number;
  validBetsUp: number;
  totalDepositAmtRm: number;
  validBetsRm: number;
  minDepositAmt: number;
  maxDepositAmt: number;
  minWithdrawalAmt: number;
  maxWithdrawalAmt: number;
  dailyMaxWDAmount: number;
  dailyMaxWDCount: number;
  updateOn?: any;
  updateBy?: any;
}

@Component({
  selector: 'app-rebate-setting-new-add',
  templateUrl: './rebate-setting-new-add.component.html',
  styleUrls: ['./rebate-setting-new-add.component.scss']
})
export class RebateSettingNewAddComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private httpSer: BaseService,
    private route: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) { }
  displayedColumns: string[] = [
    'gameProvider'
    , 'gameGroupCode'
    , 'validBets'
    , 'rebatePercent'
    , 'rebateMax'
    , 'gameExclude'];
  dataSource: table[] = [];

  form: FormGroup;

  productTypeList = [];
  vipList = [];
  tagList = [];
  gameList = [];

  preData: resData = null;
  disabled = false;

  ngOnInit(): void {
    this.initPage();
    this.createForm();
    const code = this.routeParam.snapshot.queryParams.code;
    if (code) {
      this.disabled = true;
      this.getOne(code);
    }
  }

  getOne(code) {
    this.httpSer.doGet(`${URL.REBATE}/get-by-id/${code}`).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.preData = res.data;
        this.createForm(res.data);
        console.log("get one >>>>>>>>>>>>>>>>>>>>.", res.data);

        this.initGames(res.data.productTypeCode, true);
        // this.setGamesExclude();
      }
    });
  }

  createForm(data: resData = null) {
    if (data) {
      this.form = this.fb.group({
        id: [data.id],
        title: [data.title, Validators.required],
        description: [data.description, Validators.required],
        startDate: [data.startDate, Validators.required],
        endDate: [data.endDate, Validators.required],
        periodStatus: [data.periodStatus, Validators.required],
        rebateType: [data.rebateType, Validators.required],
        isAutoRebate: [data.isAutoRebate, Validators.required],
        status: [data.status, Validators.required],
        vipGroupCode: [data.vipGroupCode, Validators.required],
        productTypeCode: [data.productTypeCode, Validators.required],
        maxGroupRebate: [data.maxGroupRebate, Validators.required],
        tagCode: [data.tagCode],
        gamesCodeExclude: [data.gamesCodeExclude.split(',')],
        rebateConditionMultiplier: [data.rebateConditionMultiplier, Validators.required]
      });

      return;
    }
    this.form = this.fb.group({
      id: [],
      title: [null, Validators.required],
      description: [null, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null, Validators.required],
      periodStatus: [1, Validators.required],
      rebateType: [1, Validators.required],
      isAutoRebate: [true, Validators.required],
      status: [true, Validators.required],
      vipGroupCode: [[], Validators.required],
      productTypeCode: [null, Validators.required],
      maxGroupRebate: [null, Validators.required],
      tagCode: [[]],
      gamesCodeExclude: [[]],
      rebateConditionMultiplier: [null, Validators.required]
    });
  }

  initPage() {
    this.getProductType();
    this.getVIPList();
    this.getTagList();
  }

  getProductType() {
    this.httpSer.doGet(`${URL.PRODUCT_TYPE}/get-all-product`).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.productTypeList = data.data;
      }
    });
  }

  async getCodeProvider(code) {
    this.initGames(code, false);
  }

  getVIPList() {
    this.httpSer.doGet(URL.GROUP_LEVEL).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.vipList = data.data;
      }
    });
  }

  getTagList() {
    this.httpSer.doGet(URL.TAG_MANAGEMENT).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.tagList = data.data;
      }
    });
  }

  openDialog(games = null, check = null): void {
    const dialogRef = this.dialog.open(RebateSettingNewAddDialogComponent,
      { data: { games, check }, width: '1000px', maxWidth: '95%', maxHeight: '90%', height: 'fit-content' });

    dialogRef.afterClosed().subscribe(result => {
      games = result;
      this.checkIsGameExclude();
    });
  }

  checkIsGameExclude() {
    let excludeList = []
    this.dataSource.forEach(element => {
      element.games.forEach(ele => {
        if (ele.isExclude) {
          excludeList.push(ele.gameCode)
        }
      })
    });
    this.form.controls.gamesCodeExclude.setValue(excludeList);
  }

  setGamesExclude() {
    let gameList = this.form.controls.gamesCodeExclude.value;
    this.dataSource.forEach((element, i) => {
      gameList.forEach(ele => {
        let index = element.games.findIndex(x => x.gameCode === ele);
        if (index >= 0) {
          this.dataSource[i].games[index].isExclude = true
        }
      });
    });
  }

  onProductChange(event) {
    this.form.controls.gamesCodeExclude.setValue([]);
    this.getCodeProvider(event.value);
  }

  insertOne() {
    if (this.validate()) {
      return;
    }
    console.log(this.prepareData());
    if (this.preData) {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.EDIT, () => {
        this.httpSer.doPut(`${URL.REBATE}`, this.prepareData()).subscribe(data => {
          if (MessageService.MSG.SUCCESS == data.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', data.message);
            this.route.navigateByUrl('rebate-management/rebate-setting-new');
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', data.message);
          }
        })
      })
    } else {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.httpSer.doPost(`${URL.REBATE}`, this.prepareData()).subscribe(data => {
          if (MessageService.MSG.SUCCESS == data.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', data.message);
            this.route.navigateByUrl('rebate-management/rebate-setting-new');
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', data.message);
          }
        })
      })
    }
  }

  validate(): boolean {
    let validate = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      validate = true
    }
    this.dataSource.forEach(element => {
      if (element.rebateMax === null || element.rebatePercent === null || element.validBets === null) {
        validate = true
      }
    });
    return validate;
  }

  prepareData() {
    const data: sendData = new sendData();
    data.id = this.form.controls.id.value;
    data.title = this.form.controls.title.value;
    data.description = this.form.controls.description.value;
    data.startDate = moment(this.form.controls.startDate.value).startOf('days').toDate();
    data.endDate = moment(this.form.controls.endDate.value).startOf('days').minute(15).toDate();
    data.periodStatus = this.form.controls.periodStatus.value;
    data.rebateType = this.form.controls.rebateType.value;
    data.isAutoRebate = this.form.controls.isAutoRebate.value;
    data.status = this.form.controls.status.value;
    data.vipGroupCode = this.form.controls.vipGroupCode.value;
    data.productTypeCode = this.form.controls.productTypeCode.value;
    data.maxGroupRebate = this.form.controls.maxGroupRebate.value;
    data.tagCode = this.form.controls.tagCode.value;
    const gameExclude: any[] = this.form.controls.gamesCodeExclude.value;
    data.gamesCodeExclude = gameExclude.join(',');
    data.rebateConditionMultiplier = this.form.controls.rebateConditionMultiplier.value;
    data.rebateConditionList = [];

    this.dataSource.forEach(element => {
      let condition: rebateCondition = new rebateCondition();
      condition.id = element.id
      condition.gameProviderCode = element.gameProviderCode
      condition.gameGroupCode = element.gameGroupCode
      condition.maxRebate = element.rebateMax
      condition.rebatePercent = element.rebatePercent
      condition.validBets = element.validBets
      data.rebateConditionList.push(condition)
    });
    return data;
  }

  remove(value: string): void {
    const index = this.form.controls.gamesCodeExclude.value.indexOf(value);

    const arr = this.form.controls.gamesCodeExclude.value;
    if (index >= 0) {
      arr.splice(index, 1);
    }
    this.form.controls.gamesCodeExclude.setValue(null);
    this.form.controls.gamesCodeExclude.setValue(arr);

    this.dataSource.forEach((element, i) => {
      let index = element.games.findIndex(x => x.gameCode === value);
      if (index >= 0) {
        this.dataSource[i].games[index].isExclude = false
      }
    });
  }

  findInGameList(code) {
    const index = this.gameList.findIndex(x => x.gameCode === code);
    if (index < 0)
      return null
    else
      return this.gameList[index].provider + '-' + this.gameList[index].game;
  }




  initGames(code, isSet: boolean) {
    this.gameList = [];
    this.httpSer.doGet(URL.GET_GAME_BY_PRODUCT_TYPE + code).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.setGameExcludeList(res.data);
        this.setTable(res.data, isSet);
        this.setGamesExclude();
      }
    });
  }
  gameProviderNameEn: string;
  gameGroupNameEn: string;
  setGameExcludeList(resData: GamesRes[]) {
    this.gameList = [];
    resData.forEach((element: GamesRes) => {
      console.log(element);
      this.gameList.push({ provider: element.gameProviderNameEn, game: element.nameEn, gameCode: element.gameCode });
    });
  }

  setTable(resData: GamesRes[], isSet: boolean) {
    const data: GamesRes[] = resData;
    const newDataSource: table[] = [];
    data.forEach((element) => {
      const findIndex = newDataSource.findIndex(x => x.gameProviderCode === element.providerCode && x.gameGroupCode === element.gameGroupCode);
      if (findIndex >= 0) {
        const game: childGame = new childGame();
        game.status = element.status;
        game.name = element.nameEn;
        game.gameCode = element.code;
        newDataSource[findIndex].games.push(game);
      } else {
        const tableData: table = new table();
        tableData.gameProvider = element.gameProviderNameEn;
        tableData.gameProviderCode = element.providerCode;
        tableData.gameGroupCode = element.gameGroupCode;
        let index = isSet ? this.preData.rebateConditionResList.findIndex(x => x.gameProviderCode === element.providerCode) : null;
        tableData.id = isSet ? this.preData.rebateConditionResList[index].id : null;
        tableData.rebateMax = isSet ? this.preData.rebateConditionResList[index].maxRebate : null;
        tableData.rebatePercent = isSet ? this.preData.rebateConditionResList[index].rebatePercent : null;
        tableData.validBets = isSet ? this.preData.rebateConditionResList[index].validBets : null;
        const game: childGame = new childGame();
        game.status = element.status;
        game.name = element.nameEn;
        game.gameCode = element.code;
        tableData.games.push(game);
        newDataSource.push(tableData);
      }
    });
    this.dataSource = newDataSource;
    console.log('setTable -> this.dataSource', this.dataSource);
  }

  myFilter = (d: Date): boolean => {
    switch (this.form.controls.periodStatus.value) {
      case 1:
        return true;
        break;
      case 2:
        const day = d.getDay();
        return day === 1;
        break;
      case 3:
        const date = d.getDate();
        return date === 1;
        break;
    }
  }
}
