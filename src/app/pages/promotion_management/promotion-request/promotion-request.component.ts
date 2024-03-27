import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PromotionRequestDialogComponent } from './promotion-request-dialog/promotion-request-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { identifierModuleUrl } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment'
@Component({
  selector: 'app-promotion-request',
  templateUrl: './promotion-request.component.html',
  styleUrls: ['./promotion-request.component.scss'],
})
export class PromotionRequestComponent implements OnInit {
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add',
      onClick: () => {
        this.router.navigate([
          'promotion-management/promotion-request/promotion-request-add',
        ]);
      },
    },
    {
      text: 'System Declined List',
      onClick: () => {
        this.router.navigate([
          'promotion-management/promotion-request/promotion-request-system-declined',
        ]);
      },
    },
  ];
  columns: any = [
    {
      header: 'Player Group',
      field: 'group',
    },
    {
      header: 'Player ID',
      field: 'playerId',
      type: 'link',
    },
    {
      header: 'Promotion Name',
      field: 'promoName',
    },
    {
      header: 'Promotion Type',
      field: 'promoType',
    },
    {
      header: 'Created Date',
      field: 'createdAt',
    },
    {
      header: 'Approved Date',
      field: 'updatedAt',
    },
    {
      header: 'Approved By',
      field: 'createdBy',
    },
    {
      header: 'Bonus Amount',
      field: 'bonus',
      type: 'textNumber'
    },
    {
      header: 'Status',
      field: 'statusRequest',
      type: 'textCenter'
    },
  ];
  actionSetting :ActionSetting = new ActionSetting({
    type: 'choice',
    textCancel: 'Reject',
    textConfirm: 'Approved',
    onCancel: (data) => {
      this.changeStatus(data, 'REJECT');
    },
    onConfirm: (data) => {
      this.changeStatus(data, 'APPROVE');
    },
    showFunction:(row)=>{
      if (row['statusRequest']=='PENDING') {
        return true
      }
      return false
    },
    listIcon:[
      {
        icon: 'edit',
        action: (row) => {
          this.openDialog(row);
        },
        showFunction:(row)=>{
          if (row['statusRequest']=='APPROVE' || row['statusRequest']=='REJECT') {
            return true
          }
          return false
        }
      },
    ]
  });
  tr: any = [
    'group',
    'playerId',
    'promoName',
    'promoType',
    'createdAt',
    'updatedAt',
    'createdBy',
    'bonus',
    'statusRequest',
    'action',
  ];
  dataInput: any = [];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';
  selected6 = '1';
  selected7 = '1';

  constructor(
    private router: Router,
    private baseService: BaseService,
    public dialog: MatDialog
  ) {
    this.promotionRequestList();
    console.log(this.actionSetting);
  }

  ngOnInit(): void {}
  promotionRequestList() {
    this.baseService.doGet('promotion-request').subscribe((data) => {
      console.table(data.data);
      this.dataInput = [];
      if (data.status === 'SUCCESS' && data.data != null) {
        data.data.forEach((element, index) => {
          this.dataInput.push({
            id: element.id,
            group: element.playerGroup,
            playerId: {
              url: '', //need link
              title:
                element.username == null || element.username == ''
                  ? ' '
                  : element.username,
            },
            promoCode: element.promoCode,
            requestId: element.requestId,
            username: element.username,
            promoName: element.promoName,
            createdAt: moment(element.createdAt).format("DD/MM/YYYY hh:mm"),
            updatedAt: moment(element.updatedAt).format("DD/MM/YYYY hh:mm"),
            promoType: element.promoType,
            createdBy: element.createdBy,
            bonus:
              element.balanceAmount == 0
                ?  Number(element.bonusAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                :  Number(element.balanceAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            statusRequest: element.statusRequest,
          });
        });
      }
    });
  }

  changeStatus(data, status) {
    this.baseService
      .doPut('promotion-request/change-status', {
        id: data.id,
        username: data.username,
        promoCode: data.promoCode,
        requestId: data.requestId,
        statusRequest: status,
      })
      .subscribe(({ data }) => {
        this.promotionRequestList();
        console.log(data);
      });
  }

  openDialog(data = null): void {
    const dialogRef = this.dialog.open(PromotionRequestDialogComponent, {
      data: data,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.promotionRequestList();
    });
  }
}
