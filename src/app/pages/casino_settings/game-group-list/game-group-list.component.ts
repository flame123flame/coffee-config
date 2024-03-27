import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
import { log } from 'console';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { MatDialog } from '@angular/material/dialog';
import { codeBlockButton } from 'ngx-summernote';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { GamesAddDialogComponent } from '../provider-setting/games-add-dialog/games-add-dialog.component';
import { GroupAddDialogComponent } from '../provider-setting/group-add-dialog/group-add-dialog.component';
import { GroupMappingProviderDialogComponent } from '../provider-setting/group-mapping-provider-dialog/group-mapping-provider-dialog.component';
import { ProviderAddDialogComponent } from '../provider-setting/provider-add-dialog/provider-add-dialog.component';


const URL = {
  GET_ALL_PROVIDER: "game-provider/get-provider-list",
  GAT_PG_PROVIDER: "game-provider/get-paginate-provider",
  DELETE_PROVIDER: "game-provider/delete-provider/",

  GET_ALL_PRODUCT: "game-product-type/get-all-product",
  GET_PG_PRODUCT: "game-product-type/get-paginate-product",
  DELETE_PRODUCT: "game-product-type/delete-product/",

  GET_ALL_GAME_GROUP: "game-group/get-all-group",
  GET_PG_GAME_GROUP: "game-group/get-paginate-group",
  DELETE_GAME_GROUP: "game-group/delete-group/",

  GET_ALL_GAMES: "games/get-all-games",
  GET_PG_GAMES: 'games/get-games',
  DELETE_GAMES: "games/delete-games/",

  SYNC_GAME: "games/get-sync-games",

}
@Component({
  selector: 'app-game-group-list',
  templateUrl: './game-group-list.component.html',
  styleUrls: ['./game-group-list.component.scss']
})
export class GameGroupListComponent implements OnInit {

   // hidePRBT = false;
   hidePDBT = false;
   hideGGBT = false;
   hideGBT = false;
   selected = new FormControl(0);
   dataPV: any;
   dataPD: any;
   dataGG: any;

   productLength: number = 0;
   productPG: PaginateRequest = new PaginateRequest();

   providerLength: number = 0;
   providerPG: PaginateRequest = new PaginateRequest();

   gamesLength: number = 0;
   gamesPG: PaginateRequest = new PaginateRequest();

   groupLength: number = 0;
   groupPG: PaginateRequest = new PaginateRequest();

   productCol = [
     {
       header: 'Code',
       field: 'codePD',
       type: 'link',
       onClick: (event) => {
         this.onClickToMapping(event)
       }
     },
     { header: "nameTh", field: "nameThPD", },
     { header: "nameEn", field: "nameEnPD", },
     { header: 'Created At', field: 'createdAtPD', type: 'textCenter' },
     { header: 'Updated At', field: 'updatedAtPD', type: 'textCenter' },
     { header: 'Updated By', field: 'updatedByPD', type: 'textCenter' },

   ]
   productData: any = []
   productTr = [
     'codePD',
     'nameThPD',
     'nameEnPD',
     'createdAtPD',
     'updatedAtPD',
     'updatedByPD',
     'action',
   ]
   providerCol = [
     { header: 'Code', field: 'codePV' },
     { header: "Name Th", field: "nameThPV", },
     { header: "Name En", field: "nameEnPV", },
     { header: 'Created At', field: 'createdAtPV', type: 'textCenter' },
     { header: 'Updated At', field: 'updatedAtPV', type: 'textCenter' },
     { header: 'Updated By', field: 'updatedByPV', type: 'textCenter' },
     { header: 'View', field: 'view', type: 'textCenter' },
   ]
   providerData: any = []
   providerTr = [
     'codePV',
     'nameThPV',
     'nameEnPV',
     'createdAtPV',
     'updatedAtPV',
     'updatedByPV',
     'view',
     'action',
   ]


   gameGroupCol = [
     {
       header: 'Code',
       field: 'codeGG',
       type: 'link',
       onClick: (event) => {
         this.onClickToMapping(event)
       }
     },
     { header: "nameTh", field: "nameThGG", },
     { header: "nameEn", field: "nameEnGG", },
     { header: 'Created At', field: 'createdAtGG', type: 'textCenter' },
     { header: 'Updated At', field: 'updatedAtGG', type: 'textCenter' },
     { header: 'Updated By', field: 'updatedByGG' },
     { header: 'Product Code', field: 'productCode' },
   ]
   gameGroupData: any = []
   gameGroupTr = [
     'codeGG',
     'nameThGG',
     'nameEnGG',
     'createdAtGG',
     'updatedAtGG',
     'updatedByGG',
     'productCode',
     'action',
   ]

   gamesCol = [
     { header: 'Display Name', field: "displayName" },
     { header: "nameTh", field: "nameThG", },
     { header: "nameEn", field: "nameEnG", },
     // { header: 'Game Tag', field: "gameTag" },
     { header: 'Game Code', field: "gameCode" },
     { header: 'Game Product Type', field: "gameProduct" },
     { header: 'Game Provider', field: "provider" },
     { header: 'Created At', field: "createdAtG", type: 'textCenter' },
     { header: 'Updated By', field: "updatedAtG", type: 'textCenter' },
     { header: 'Updated At', field: "updatedByG", type: 'textCenter' },
     { header: 'Status', field: "status", type: 'textCenter' },
     { header: 'Remark', field: "remark" }
   ]
   gamesData: any = []
   gamesTr = [
     'gameCode',
     'nameThG',
     'nameEnG',
     'displayName',
     // 'gameTag',
     'gameProduct',
     'provider',
     'createdAtG',
     'updatedAtG',
     'updatedByG',
     'status',
     'remark',
     'action',
   ]

   constructor(
     private httpService: BaseService,
     public dialog: MatDialog,
   ) { }

   ngOnInit() {
    //  this.getAllProvider()
    //  this.getAllProduct()
     this.getAllGameGroup()
    //  this.getAllGames()
     // this.getgame()

   }

   onTabChange(data) {
     console.log(data.index);

     // if (data.index == 1 && this.dataPV) {
     //   console.log("1 if");
     //   this.hidePDBT = true;
     //   this.hideGGBT = false;
     //   this.hideGBT = false;
     // }
     // else if (data.index == 2 && this.dataPD) {
     //   console.log("2 else if");
     //   this.hideGGBT = true;
     //   this.hidePDBT = false;
     //   this.hideGBT = false;
     // }
     // else if (data.index == 3 && this.dataGG) {
     //   console.log("3 else if");
     //   this.hideGBT = true;
     //   this.hidePDBT = false;
     //   this.hideGGBT = false;
     // }
     // else {
     //   console.log("else");
     //   this.dataPV = null
     //   this.dataPD = null
     //   this.dataGG = null
     //   this.hidePDBT = false;
     //   this.hideGGBT = false;
     //   this.hideGBT = false;
     // }

   }



   getAllProduct() {
     let wordSort: PaginateSort = new PaginateSort();
     wordSort.column = 'updated_at';
     wordSort.order = 'desc';
     this.productPG.sort.push(wordSort);
     let wordSort1: PaginateSort = new PaginateSort();
     wordSort1.column = 'created_at';
     wordSort1.order = 'desc';
     this.productPG.sort.push(wordSort1);
     this.httpService.doPost(URL.GET_PG_PRODUCT, this.productPG).subscribe(res => {
       if (MessageService.MSG.SUCCESS == res.status) {
         this.productData = res.data.data.map(data => {
           return {
             codePD: data.code,
             nameThPD: data.nameTh ?? '-',
             nameEnPD: data.nameEn ?? '-',
             createdAtPD: moment(data.createdAt).format('DD/MM/YYYY HH:mm:ss'),
             updatedAtPD: data.updatedAt ? moment(data.updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-',
             updatedByPD: data.updatedBy,
             // moment(element.updatedAt).format('DD/MM/YYYY HH:mm:ss')
           }
         })
         this.productLength = res.data.recordsTotal
       }
       this.productPG.sort = []
     })
   }







   saveProductType() {
     const dialogRef = this.dialog.open(ProviderAddDialogComponent, { data: { type: 'product', data: null }, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllProduct()
     });
   }
   onEditProduct(data) {
     const dialogRef = this.dialog.open(ProviderAddDialogComponent, { data: { type: 'product', data }, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllProduct()
     });
   }

   onDeleteProduct(data) {
     console.log(data.codePD);
     let code = data.codePD;
     DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
       this.httpService.doDelete(URL.DELETE_PRODUCT + code).subscribe(res => {
         if (MessageService.MSG.SUCCESS == res.status) {
           DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
           this.getAllProduct()
         } else {
           DialogSweetAlertService.opentModalSweetAlertError('', res.message)
         }
       })
     });

   }

   pageProductChange(event: PageChangeModel) {
     this.productPG.page = event.pageIndex
     this.productPG.length = event.pageSize
     this.getAllProduct();
   }

   sortProductChange(event: SortChangeModel) {
     this.productPG.sort = []
     if (event.direction) {
       let sort: PaginateSort = new PaginateSort();
       sort.column = event.active
       sort.order = event.direction
       this.productPG.sort.push(sort)
     }
     this.getAllProduct();
   }





   getAllProvider() {
     let wordSort1: PaginateSort = new PaginateSort();
     wordSort1.column = 'created_at';
     wordSort1.order = 'desc';
     this.providerPG.sort.push(wordSort1);
     let wordSort: PaginateSort = new PaginateSort();
     wordSort.column = 'updated_at';
     wordSort.order = 'desc';
     this.providerPG.sort.push(wordSort);
     this.httpService.doPost(URL.GAT_PG_PROVIDER, this.providerPG).subscribe(res => {
       if (MessageService.MSG.SUCCESS == res.status) {
         this.providerData = res.data.data.map(data => {
           return {
             codePV: data.code,
             nameThPV: data.nameTh ?? '-',
             nameEnPV: data.nameEn ?? '-',
             createdAtPV: moment(data.createdAt).format('DD/MM/YYYY HH:mm:ss'),
             updatedAtPV: data.updatedAt ? moment(data.updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-',
             updatedByPV: data.updatedBy,
             view: data.statusView ? 'Active' : 'Disabled',
             iconPortrait: data.iconPortrait ?? null,
             iconLandscape: data.iconLandscape ?? null,
           }
         })
         this.providerLength = res.data.recordsTotal;
       }
       this.providerPG.sort = []
     })
   }

   onSaveProvider() {
     const dialogRef = this.dialog.open(ProviderAddDialogComponent, { data: { type: 'provider', data: null }, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllProvider()
     });
   }
   onEditProvider(data) {
     const dialogRef = this.dialog.open(ProviderAddDialogComponent, { data: { type: 'provider', data }, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllProvider()
     });
   }
   onDeleteProvider(data) {
     console.log(data);
     let code = data.codePV;
     DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
       this.httpService.doDelete(URL.DELETE_PROVIDER + code).subscribe(res => {
         if (MessageService.MSG.SUCCESS == res.status) {
           DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
           this.getAllProvider()
         } else {
           DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
         }
       })
     });

   }

   pageProviderChange(event: PageChangeModel) {
     this.providerPG.page = event.pageIndex
     this.providerPG.length = event.pageSize
     this.getAllProvider();
   }

   sortProviderChange(event: SortChangeModel) {
     this.providerPG.sort = []
     if (event.direction) {
       let sort: PaginateSort = new PaginateSort();
       sort.column = event.active
       sort.order = event.direction
       this.providerPG.sort.push(sort)
     }
     this.getAllProvider();
   }

   onClickToProduct(data) {
     console.log(data);
     this.hidePDBT = true;
     this.selected.setValue(1)
     this.dataPV = data;
   }

   // getgame() {
   //   this.httpService.doGet(URL.getgame).subscribe(res => {

   //   })
   // }

   onClickToMapping(data) {
     console.log(data);
     // this.hidePDBT = true;
     // this.selected.setValue(2)
     // this.dataPD = data;

     const dialogRef = this.dialog.open(GroupMappingProviderDialogComponent, { data: data, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
     });


   }



   getAllGameGroup() {
     // this.httpService.doGet(URL.GET_ALL_GAME_GROUP).subscribe(res => {
     //   if (MessageService.MSG.SUCCESS == res.status) {
     //     this.gameGroupData = res.data.map(data => {
     //       return {
     //         provider: data.provider,
     //         codePD: data.gameProductTypeCode,
     //         codeGG: data.code,
     //         nameThGG: data.nameTh,
     //         nameEnGG: data.nameEn,
     //         createdAtGG: moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss'),
     //         updatedAtGG: data.updatedAt ? moment(data.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-',
     //         updatedByGG: data.updatedBy,
     //       }
     //     })
     //   }
     // })
     let wordSort1: PaginateSort = new PaginateSort();
     wordSort1.column = 'created_at';
     wordSort1.order = 'desc';
     this.groupPG.sort.push(wordSort1);
     let wordSort: PaginateSort = new PaginateSort();
     wordSort.column = 'updated_at';
     wordSort.order = 'desc';
     this.groupPG.sort.push(wordSort);
     this.httpService.doPost(URL.GET_PG_GAME_GROUP,this.groupPG).subscribe(res => {
       if (MessageService.MSG.SUCCESS == res.status) {
         this.gameGroupData = res.data.data.map(data => {
           return {
             codeGG: data.code,
             nameThGG: data.nameTh ?? '-',
             nameEnGG: data.nameEn ?? '-',
             createdAtGG: moment(data.createdAt).format('DD/MM/YYYY HH:mm:ss'),
             updatedAtGG: data.updatedAt ? moment(data.updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-',
             updatedByGG: data.updatedBy,
             productCode: data.productCode ?? '-',
             // view: data.statusView ? 'Active' : 'Disabled',
           }
         })
         this.groupLength = res.data.recordsTotal;
       }
       this.groupPG.sort = []
     })
   }
   saveGameGroup() {
     const dialogRef = this.dialog.open(GroupAddDialogComponent, { data: null, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllGameGroup()
     });
   }
   onEditGameGroup(data) {
     const dialogRef = this.dialog.open(GroupAddDialogComponent, { data: data, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllGameGroup()
     });
   }

   onDeleteGameGroup(data) {
     console.log(data);
     let code = data.codeGG
     DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
       this.httpService.doDelete(URL.DELETE_GAME_GROUP + code).subscribe(res => {
         if (MessageService.MSG.SUCCESS == res.status) {
           DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
           this.getAllGameGroup()
         } else {
           DialogSweetAlertService.opentModalSweetAlertError('', res.message)
         }
       })
     });
   }

   pageGroupChange(event: PageChangeModel) {
     this.groupPG.page = event.pageIndex
     this.groupPG.length = event.pageSize
     this.getAllGameGroup();
   }

   sortGroupChange(event: SortChangeModel) {
     this.groupPG.sort = []
     if (event.direction) {
       let sort: PaginateSort = new PaginateSort();
       sort.column = event.active
       sort.order = event.direction
       this.groupPG.sort.push(sort)
     }
     this.getAllGameGroup();
   }








   onClickToGames(data) {
     console.log(data);
     this.hideGGBT = true;
     this.selected.setValue(3)
     this.dataGG = data;
   }

   getAllGames() {
     let wordSort1: PaginateSort = new PaginateSort();
     wordSort1.column = 'created_at';
     wordSort1.order = 'desc';
     this.gamesPG.sort.push(wordSort1);
     let wordSort: PaginateSort = new PaginateSort();
     wordSort.column = 'updated_at';
     wordSort.order = 'desc';
     this.gamesPG.sort.push(wordSort);
     this.httpService.doPost(URL.GET_PG_GAMES, this.gamesPG).subscribe(res => {
       if (MessageService.MSG.SUCCESS == res.status) {
         this.gamesData = res.data.data.map(data => {
           return {
             nameThG: data.nameTh ?? '-',
             nameEnG: data.nameEn ?? '-',
             displayName: data.displayName,
             code: data.code,
             gameCode: data.gameCode,
             gameProduct: data.gameProductTypeCode,
             provider: data.providerCode,
             createdAtG: data.createdAt ? moment(data.createdAt).format('DD/MM/YYYY HH:mm:ss') : '-',
             updatedAtG: data.updatedAt ? moment(data.updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-',
             updatedByG: data.updatedBy,
             status: data.status ? 'Active' : 'Disabled',
             remark: data.remark ?? '-',
           }
         })
         this.gamesLength = res.data.recordsTotal
       }
       this.gamesPG.sort = []
     });
   }

   syncGames() {
     console.log("sync");
     DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SYNCDATA, () => {
       this.httpService.doGet(URL.SYNC_GAME).subscribe(res => {
         if (MessageService.MSG.SUCCESS == res.status) {
           DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
           this.getAllGames()
         } else {
           DialogSweetAlertService.opentModalSweetAlertError('', res.message);
         }
       })
     });
   }
   saveGames() {
     const dialogRef = this.dialog.open(GamesAddDialogComponent, { data: null, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllGames()
     });

   }
   onEditGames(data) {
     const dialogRef = this.dialog.open(GamesAddDialogComponent, { data: data, width: 'auto' });
     dialogRef.afterClosed().subscribe(result => {
       this.getAllGames()
     });
   }
   onDeleteGames(data) {
     console.log(data);
     let code = data.gameCode;
     DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
       this.httpService.doDelete(URL.DELETE_GAMES + code).subscribe(res => {
         if (MessageService.MSG.SUCCESS == res.status) {
           DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
           this.getAllGames()
         } else {
           DialogSweetAlertService.opentModalSweetAlertError('', res.message);
         }
       })
     })

   }

   pageGameChange(event: PageChangeModel) {
     this.gamesPG.page = event.pageIndex
     this.gamesPG.length = event.pageSize
     this.getAllGames();
   }

   sortGameChange(event: SortChangeModel) {
     this.gamesPG.sort = []
     if (event.direction) {
       let sort: PaginateSort = new PaginateSort();
       sort.column = event.active
       sort.order = event.direction
       this.gamesPG.sort.push(sort)
     }
     this.getAllGames();
   }
}
