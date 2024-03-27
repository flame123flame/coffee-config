import { DatatableService } from './../../../service/DatatableService.service';
import { GameTagModel } from './../../../models/respons-interface/GameTag';
import { GamesAddDialogComponent } from './../provider-setting/games-add-dialog/games-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GameListDisplayNameDialogComponent } from './game-list-display-name-dialog/game-list-display-name-dialog.component';
import { from } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import {
  PaginateRequest,
  PaginateFilter,
} from 'src/app/models/PaginateRequest';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import * as moment from 'moment';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { PageChangeModel } from 'src/app/models/MatTableChange';
const URL = {
  // GAMES: "games",
  // GAME_GROUP: "game-group",
  // GAME_PROVIDER: "game-provider",
  // GAME_PRODUCT_TYPE: "game-product-type",
  // GET_BY_CODE: "get-by-code",
  // PAGINATE: "games/paginate"
  SYNC_GAME: 'games/get-sync-games',
  GET_ALL_PROVIDER: 'game-provider/get-provider-list',
  GET_ALL_PRODUCT: 'game-product-type/get-all-product',
  GET_PG_GAME_LIST: 'games/get-game-list',
  DELETE_GAMES: "games/delete-games/",
};

class paginateData {
  id?: number;
  displayName: string;
  provider: string;
  productType: string;
  gameTag: string;
  pc: boolean;
  pcdl: boolean;
  mApp: boolean;
  mH5: boolean;
  mini: boolean;
  minRtp: number;
  maxRtp: number;
  updatedBy: string;
  updatedAt: string;
  status: string;
  remark: string;
  data: any;
}
@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {
  columns: any = [
    // { header: '#', field: "id" },
    {
      header: 'Display Name',
      field: 'displayName',
      type: 'link',
      onClick: (event) => {
        this.openDialog(event);
      },
    },
    { header: 'Provider', field: 'provider' },
    { header: 'Product Type', field: 'productType' },
    // { header: 'Game Group', field: "gameGroup" },
    { header: 'Game Tag', field: 'gameTag' },
    // { header: 'PC', field: "pc" },
    // { header: 'PC D/L', field: "pcdl" },
    // { header: 'M. App', field: "mApp" },
    // { header: 'M. H5', field: "mH5" },
    // { header: 'Mini', field: "mini" },
    // { header: 'Min Rtp%', field: "minRtp" },
    // { header: 'Max Rtp%', field: "maxRtp" },
    { header: 'Updated By', field: 'updatedBy', type: 'textCenter' },
    { header: 'Updated On', field: 'updatedAt', type: 'textCenter' },
    { header: 'Status', field: 'status', type: 'textCenter' },
    { header: 'Remark', field: 'remark' },
  ];

  tr: any = [
    'displayName',
    'provider',
    'productType',
    // 'gameGroup',
    'gameTag',
    // 'pc',
    // 'pcdl',
    // 'mApp',
    // 'mH5',
    // 'mini',
    // 'minRtp',
    // 'maxRtp',
    'updatedBy',
    'updatedAt',
    'status',
    'remark',
    'action',
  ];
  actionSetting = new ActionSetting({
    hideEdit: true,
    hideDelete: true,
    hideDetail: false,
  });
  data: paginateData[] = [];
  providerList = [];
  productTypeList = [];
  // gameGroupList = [];

  constructor(
    private httpSer: BaseService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProviderList();
    this.getProductTypeList();
    this.loadList();
  }

  getProviderList() {
    this.httpSer.doGet(URL.GET_ALL_PROVIDER).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.providerList = res.data;
      }
    });
  }

  getProductTypeList() {
    this.httpSer.doGet(URL.GET_ALL_PRODUCT).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.productTypeList = res.data;
      }
    });
  }

  getGameGroupList(value) {
    // this.httpSer.doGet(`${URL.GAME_GROUP}/${URL.GET_BY_CODE}/${value}`).subscribe(data => {
    //   if (data.status == "SUCCESS") {
    //     this.gameGroupList = data.data
    //   }
    // })
  }

  openDialog(data = null): void {
    const dialogRef = this.dialog.open(GameListDisplayNameDialogComponent, {
      data: data,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadList();
    });
  }

  openDialogGames(data = null): void {
    let dataIn = data;
    dataIn.nameThG = data.nameTh;
    dataIn.nameEnG = data.nameEn;
    dataIn.gameProduct = data.gameProductTypeCode;
    dataIn.provider = data.providerCode;
    const dialogRef = this.dialog.open(GamesAddDialogComponent, {
      data: dataIn,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadList();
    });
  }

  length = 0;
  loadList() {
    this.createParam();
    this.httpSer
      .doPost(URL.GET_PG_GAME_LIST, this.paginateReq)
      .subscribe((res) => {
        if (res.status == 'SUCCESS') {
          this.data = res.data.data.map((element) => {
            return {
              id: element.id,
              displayName: element.displayName,
              provider: element.providerName,
              productType: element.productTypeName,
              gameTag: element.gameTag,
              updatedBy: element.updatedBy,
              updatedAt: element.updatedAt
                ? moment(element.updatedAt).format('DD/MM/YYYY HH:mm:ss')
                : '-',
              status: element.status ? 'ACTIVE' : 'DISABLE',
              remark: element.remark,
              image1: element.image1,
              image2: element.image2,
              data: element,
            };
          });
          this.data = DatatableService.setEmptyData(this.data);
          this.length = res.data.recordsTotal;
        }
      });
  }

  paginateReq: PaginateRequest = new PaginateRequest();

  provider = null;
  type = null;
  status = null;

  createParam() {
    this.paginateReq.sort = [];
    this.paginateReq.filter = [];

    if (this.provider) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'g.provider_code';
      wordFilter.op = '=';
      wordFilter.value = this.provider;
      this.paginateReq.filter.push(wordFilter);
    }
    if (this.type) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'g.game_product_type_code';
      wordFilter.op = '=';
      wordFilter.value = this.type;
      this.paginateReq.filter.push(wordFilter);
    }
    if (this.status || this.status == 0) {
      let wordFilter: PaginateFilter = new PaginateFilter();
      wordFilter.column = 'g.status';
      wordFilter.op = '=';
      wordFilter.value = this.status;
      this.paginateReq.filter.push(wordFilter);
    }
  }

  search() {
    this.loadList();
  }

  reset() {
    this.provider = null;
    this.type = null;
    this.status = null;
  }

  onClickEdit(event) {
    this.openDialogGames(event.data);
  }
  onClickDelete(event) {
    console.log(event.data.gameCode);
    DialogSweetAlertService.opentModalSweetAlertConfirm(MessageService.DIALOGMSGCONFIRM.DELETE, MessageService.DIALOGMSGCONFIRM.DANGER, () => {
      this.httpSer.doDelete(URL.DELETE_GAMES + event.data.gameCode).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.loadList()
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    })
  }
  syncGames() {
    console.log('sync');
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SYNCDATA,
      () => {
        this.httpSer.doGet(URL.SYNC_GAME).subscribe((res) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess(
              '',
              res.message
            );
            this.loadList();
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        });
      }
    );
  }

  saveGames() {
    const dialogRef = this.dialog.open(GamesAddDialogComponent, {
      data: null,
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadList();
    });
  }

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex;
    this.paginateReq.length = event.pageSize;
    this.loadList();
  }

}

