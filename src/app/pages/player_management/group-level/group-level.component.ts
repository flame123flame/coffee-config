import { group } from '@angular/animations';
import { MessageService } from './../../../service/message.service';
import { BaseService } from './../../../service/BaseService.service';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmReAssignLevelComponent } from './dialog/confirm-re-assign-level/confirm-re-assign-level.component';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import * as moment from 'moment';
const URL = {
  GET_ALL: 'groupLevel/getAllGroupLevel',
  DELETE: 'groupLevel/deleteGroupLevel/',
};
@Component({
  selector: 'app-group-level',
  templateUrl: './group-level.component.html',
  styleUrls: ['./group-level.component.scss'],
})
export class GroupLevelComponent implements OnInit {
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add New Group',
      onClick: () => {
        this.router.navigate([
          'player-management/group-level/group-level-add-new-group',
        ]);
      },
    },
  ];
  columns = [
    {
      header: '#',
      field: 'idx',
    },
    {
      header: 'Group Name',
      field: 'groupName',
      type: 'link',
      onClick: (data) => {
        console.log(data);
        this.router.navigate(
          ['player-management/group-level/group-level-add-new-group'],
          { queryParams: { groupCode: data.groupCode, viewDetail: true } }
        );
      },
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter',
    },
    {
      header: 'Players',
      field: 'players',
      type: 'linkNumber',
      onClick: (data) => {
        console.log(data);
      },
    },
    {
      header: 'Deposit Limit Amt (min - max)',
      field: 'depositLimitAmt',
      type: 'textNumber',
    },
    {
      header: 'Withdrawal Limit Amt (min - max)',
      field: 'withdrawalLimitAmt',
      type: 'textNumber',
    },
    {
      header: 'Update On',
      field: 'updateOn',
      type: 'textCenter',
    },
    {
      header: 'Update By',
      field: 'updateBy',
      type: 'textCenter',
    },
    {
      header: 'Group Icon',
      field: 'groupIconImg',
      type: 'image',
    },
  ];

  dataInput = [];

  tr: any = [
    'idx',
    'groupName',
    'groupIconImg',
    'status',
    'players',
    'depositLimitAmt',
    'withdrawalLimitAmt',
    'updateOn',
    'updateBy',
    'action',
  ];

  actionSetting = new ActionSetting({
    hideEdit: true,
    hideDelete: true,
  });
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private httpService: BaseService
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  openDialog() {
    this.dialog.open(ConfirmReAssignLevelComponent);
  }

  onDelete(data) {
    this.httpService.doDelete(URL.DELETE + data.groupCode).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        alert(res.status);
        this.loadList();
      }
    });
  }

  editData(data) {
    console.log(data);
    this.router.navigate(
      ['player-management/group-level/group-level-add-new-group'],
      { queryParams: { groupCode: data.groupCode, viewDetail: false } }
    );
  }
  onCreatGroup() {
    this.router.navigate([
      'player-management/group-level/group-level-add-new-group',
    ]);
  }

  loadList() {
    this.httpService.doGet(URL.GET_ALL).subscribe((res) => {
      console.log(res.data);
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.map((data, idx) => {
          return {
            idx: idx + 1,
            id: data.id,
            groupCode: data.groupCode,
            groupName: data.groupName,
            groupIconImg: data.groupIconImg,
            status: data.status,
            players: data.countPlayer,
            depositLimitAmt:
              Number(data.minDepositAmt).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) +
              ' - ' +
              Number(data.maxDepositAmt).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            withdrawalLimitAmt:
              Number(data.minWithdrawalAmt).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) +
              ' - ' +
              Number(data.maxWithdrawalAmt).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            updateOn: moment(data.updateOn).format('DD/MM/YYYY'),
            updateBy: data.updateBy,
          };
        });
      }
    });
  }
}
