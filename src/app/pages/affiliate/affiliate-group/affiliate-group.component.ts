import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { MessageService } from './../../../service/message.service';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/service/BaseService.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
const URL = {
  GET_ALL: "affiliate-group/get-affiliate-group-all",
  DELETE: "affiliate-group/delete-affiliate-group/",
}
@Component({
  selector: 'app-affiliate-group',
  templateUrl: './affiliate-group.component.html',
  styleUrls: ['./affiliate-group.component.scss']
})
export class AffiliateGroupComponent implements OnInit {


  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add ',
      onClick: () => {
        this.router.navigate(['affiliate/affiliate-group/affiliate-group-add']);
      },
    },
  ];
  columns = [
    {
      header: "#",
      field: "id"
    },
    {
      header: "Affiliate Group Name",
      field: "groupName"
    },
    {
      header: "Description",
      field: "description"
    },
    {
      header: "Withdraw Condition",
      field: "withdrawCondition",
      type: 'textNumber'
    },
    {
      header: "Min Total Bets",
      field: "minTotalBets",
      type: 'textNumber'
    },
    {
      header: "Min Affiliate Count",
      field: "minAffiliateCount",
      type: 'textNumber'
    },
    {
      header: "Min Total Income",
      field: "minTotalIncome",
      type: 'textNumber'
    },
    {
      header: "Created By",
      field: "createdBy",
      type: 'textCenter'
    },
    {
      header: "Created Date",
      field: "createdDate",
      type: 'textCenter'
    },
    {
      header: "Updated By",
      field: "updatedBy",
      type: 'textCenter'
    },
    {
      header: "Updated Date",
      field: "updatedDate",
      type: 'textCenter'
    },
  ]
  dataInput = []
  tr: any = [
    'id',
    'groupName',
    'description',
    'withdrawCondition',
    'minTotalBets',
    'minAffiliateCount',
    'minTotalIncome',
    'createdBy',
    'createdDate',
    'updatedBy',
    'updatedDate',
    'action',
  ]

  actionSetting = new ActionSetting({
    hideEdit: true,
    hideDelete: true,
    hideDetail: false,
  })

  constructor(
    private router: Router,
    private httpService: BaseService
  ) { }

  ngOnInit(): void {
    this.getAllList();
  }
  getAllList() {
    this.httpService.doGet(URL.GET_ALL).subscribe(res => {
      console.log(res.data);
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.map((data, inx) => {
          return {
            id: inx + 1,
            affiliateGroupCode: data.affiliateGroupCode,
            groupName: data.groupName,
            description: data.description,
            withdrawCondition: Number(data.withdrawCondition).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            minTotalBets: Number(data.minTotalBets).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            minAffiliateCount: Number(data.minAffiliateCount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            minTotalIncome: Number(data.minTotalIncome).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            createdBy: data.createdBy,
            createdDate: moment(data.createdDate).format('DD/MM/YYYY HH:mm:ss'),
            updatedBy: data.updatedBy,
            updatedDate: moment(data.updatedDate).format('DD/MM/YYYY HH:mm:ss')
          }
        })
      } else {

      }
    })
  }
  deleteOne(data) {
    console.log(data);
    this.httpService.doDelete(URL.DELETE + data.affiliateGroupCode).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        alert(res.status);
        this.getAllList();
      }
    })
  }
  editData(data) {
    console.log(data);
    this.router.navigate(['affiliate/affiliate-group/affiliate-group-add'],
      { queryParams: { affiliateGroupCode: data.affiliateGroupCode } });
  }
}
