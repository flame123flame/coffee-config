import { PrsShowSettingComponent } from './dialog/prs-show-setting/prs-show-setting.component';
import { ActionSetting } from './../../../models/ActionSettingModel';
import { Component, OnInit } from '@angular/core';
import { MenuDropdownItem } from 'src/app/models/MenuDropdownItem';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PrsEditDisplayOrderComponent } from './dialog/prs-edit-display-order/prs-edit-display-order.component';
import { PrsUniversalSettingComponent } from './dialog/prs-universal-setting/prs-universal-setting.component';
import { MessageService } from 'src/app/service/message.service';
import { BaseService } from 'src/app/service/BaseService.service';
import { PrsReviewPageComponent } from './dialog/prs-review-page/prs-review-page.component';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import {
  PageChangeModel,
  SortChangeModel,
} from 'src/app/models/MatTableChange';
import {
  PaginateRequest,
  PaginateSort,
  PaginateFilter,
} from 'src/app/models/PaginateRequest';
import { PromotionModel } from 'src/app/models/respons-interface/Promotion';
import { MatIcon } from 'src/app/models/MatIcon';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { start } from 'repl';
import { log } from 'console';
const URL = {
  GET_LIST_PROMOTION: 'promotion/paginate',
  DELETE_PROMOTION: 'promotion',
  TOGGLE_STATUS: 'promotion/toggle-status',
};
@Component({
  selector: 'app-promotion-rule-setting',
  templateUrl: './promotion-rule-setting.component.html',
  styleUrls: ['./promotion-rule-setting.component.scss'],
})
export class PromotionRuleSettingComponent implements OnInit {
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Universal Setting',
      onClick: () => {
        this.openDialog(PrsUniversalSettingComponent, {});
      },
    },
    {
      text: 'Edit Display Order',
      onClick: () => {
        this.openDialog(PrsEditDisplayOrderComponent, {});
      },
    },
    {
      text: 'Add ',
      onClick: () => {
        this.router.navigate(['promotion-management/promotion-rule-add']);
      },
    },
  ];
  columns = [
    {
      header: '#',
      field: 'id',
    },
    {
      header: 'Promotion Title',
      field: 'promoTitle',
      type: 'link',
      onClick: (data) => {
        this.openDialogShowSetting(data.promoCode);
      },
    },
    {
      header: 'Promotion Type',
      field: 'promoType',
    },
    {
      header: 'Wallet',
      field: 'wallet',
    },
    {
      header: 'Promotion Period',
      field: 'promoPeriodType',
    },
    {
      header: 'Updated By',
      field: 'updatedBy',
      type: 'textCenter',
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter',
    },
  ];

  tr: any = [
    'id',
    'promoTitle',
    'promoType',
    'wallet',
    'promoPeriodType',
    'status',
    'action',
  ];
  dataInput = [];

  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';

  actionSetting: ActionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: false,
    listIcon: [
      {
        color: 'black',
        icon: MatIcon.EDIT,
        showFunction: (row, i) => {
          return (
            this.getPromotionStatus(row.startDate, row.endDate) != 'FINISTED'
          );
        },
        action: (row, i) => {
          this.editOrClonePromotion('EDIT', row.promoCode, row.promoType);
        },
        type: 'icon',
        tooltip: 'Edit',
      },
      {
        color: 'black',
        icon: MatIcon.COPY,
        showFunction: (row, i) => {
          return true;
        },
        action: (row, i) => {
          this.editOrClonePromotion('CLONE', row.promoCode, row.promoType);
        },
        type: 'icon',
        tooltip: 'Clone',
      },
      {
        color: 'red',
        icon: MatIcon.DELETE,
        showFunction: (row, i) => {
          return row.deleteAble;
        },
        action: (row, i) => {
          this.deleteOne(row.promoId);
        },
        type: 'icon',
        tooltip: 'Delete',
      },
      {
        color: 'blue',
        icon: MatIcon.VISIBILITY,
        showFunction: (row, i) => {
          return row.viewStatus == 'SHOW';
        },
        action: (row, i) => {
          this.toggleShowStatus(row.promoId);
        },
        type: 'icon',
        tooltip: 'Hide',
      },
      {
        color: 'gray',
        icon: MatIcon.VISIBILITY_OFF,
        showFunction: (row, i) => {
          return row.viewStatus == 'HIDE';
        },
        action: (row, i) => {
          this.toggleShowStatus(row.promoId);
        },
        type: 'icon',
        tooltip: 'Show',
      },
    ],
  });

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private httpService: BaseService
  ) {}

  ngOnInit(): void {
    this.loadList();
  }
  openDialog(dialogComponent: any, data: any) {
    this.dialog.open(dialogComponent, {
      data: data,
      width: '600px',
    });
  }
  openDialogShowSetting(data: any) {
    this.dialog.open(PrsShowSettingComponent, {
      data: data,
      width: '95%',
      height: '95%',
      maxHeight: '98%',
    });
  }

  loadList() {
    this.httpService
      .doPost(URL.GET_LIST_PROMOTION, this.paginateReq)
      .subscribe((res: RequestPaginateRespond<PromotionModel>) => {
        console.table(res.data);
        if (MessageService.MSG.SUCCESS == res.status) {
          this.dataInput = res.data.data.map((data, inx) => {
            return {
              id: inx + 1,
              promoId: data.id,
              promoTitle: data.promoTitle,
              promoType: data.promoType,
              promoCode: data.promoCode,
              wallet: data.receiveBonusWallet,
              promoPeriodType: data.promoPeriodType,
              updatedBy: data.updatedBy,
              deleteAble: data.deleteAble,
              viewStatus: data.viewStatus,
              startDate: data.startDate,
              endDate: data.endDate,
              status: this.getPromotionStatus(data.startDate, data.endDate),
            };
          });
          this.length = res.data.recordsTotal;
        }
      });
  }

  length: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest();

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex;
    this.paginateReq.length = event.pageSize;
    this.loadList();
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = [];
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateReq.sort.push(sort);
    }
    this.loadList();
  }

  filter() {
    this.paginateReq.filter = [];
    // if (this.periodType != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'p.promo_period_type';
    //   filter.op = '=';
    //   filter.value = this.periodType;
    //   this.paginateReq.filter.push(filter);
    // }
    // if (this.promoCategory != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'p.promo_type';
    //   filter.op = '=';
    //   filter.value = this.promoCategory;
    //   this.paginateReq.filter.push(filter);
    // }
    // if (this.promoTitle != null) {
    //   let filter: PaginateFilter = new PaginateFilter();
    //   filter.column = 'p.promo_title';
    //   filter.op = 'contain';
    //   filter.value = this.promoTitle;
    //   this.paginateReq.filter.push(filter);
    // }
    this.loadList();
  }

  getPromotionStatus(startDate: Date, endDate: Date) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let current = new Date();
    if (current < startDate) {
      return 'UPCOMING';
    }
    if (current > endDate) {
      return 'FINISTED';
    } else {
      return 'IN PROGRESS';
    }
  }

  deleteOne(id) {
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.DELETE,
      () => {
        this.httpService
          .doDelete(`${URL.DELETE_PROMOTION}/${id}`)
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
              this.loadList();
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }
  toggleShowStatus(id) {
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.EDIT,
      () => {
        this.httpService
          .doPut(`${URL.TOGGLE_STATUS}/${id}`, {})
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
              this.loadList();
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }

  readonly TYPE_REGISTER = 'Registration';
  readonly TYPE_FIRST_ANDS_SECOND = '1st&2ndDeposit';
  readonly TYPE_CUSTOMIZE = 'Customized';
  readonly TYPE_GENERAL_DEPOSIT = 'GeneralDeposit';
  readonly TYPE_PROMOTION_POSTING = 'Promotion Posting';

  editOrClonePromotion(op: string, promoCode: string, promoType: string) {
    switch (promoType) {
      case this.TYPE_CUSTOMIZE:
        this.router.navigate(
          ['promotion-management/promotion-rule-add/customized'],
          { queryParams: { op: op, promoCode: promoCode } }
        );
        console.log('promoType =' + 1);
        break;
      case this.TYPE_FIRST_ANDS_SECOND:
        this.router.navigate(
          ['promotion-management/promotion-rule-add/first-and-second-deposit'],
          { queryParams: { op: op, promoCode: promoCode } }
        );
        console.log('promoType =' + 2);
        break;
      case this.TYPE_PROMOTION_POSTING:
        this.router.navigate(
          ['promotion-management/promotion-rule-add/promotion-posting'],
          { queryParams: { op: op, promoCode: promoCode } }
        );
        console.log('promoType =' + 3);
        break;
      case this.TYPE_REGISTER:
        this.router.navigate(
          ['promotion-management/promotion-rule-add/registrantion'],
          { queryParams: { op: op, promoCode: promoCode } }
        );
        console.log('promoType =' + 4);
        break;
      case this.TYPE_GENERAL_DEPOSIT:
        this.router.navigate(
          ['promotion-management/promotion-rule-add/general-deposit'],
          { queryParams: { op: op, promoCode: promoCode } }
        );
        console.log('promoType =' + 5);
        break;
    }
  }
}
