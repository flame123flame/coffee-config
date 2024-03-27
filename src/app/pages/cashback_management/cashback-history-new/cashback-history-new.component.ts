import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  GET_ALL: 'cashback-history/get-history',
  GET_CAL: 'cashback-history/sync-cashback'
}
@Component({
  selector: 'app-cashback-history-new',
  templateUrl: './cashback-history-new.component.html',
  styleUrls: ['./cashback-history-new.component.scss']
})
export class CashbackHistoryNewComponent implements OnInit {
  columns = [
    {
      header: 'Audit Date',
      field: 'createdDate',
    },
    {
      header: 'Player ID',
      field: 'username',
    },

    {
      header: 'Player Group',
      field: 'groupName',
    },
    {
      header: 'Cashback Title',
      field: 'cashbackTitle',
    },
    {
      header: 'Auto Cashback',
      field: 'isAutoCashback',
    },
    {
      header: 'Total Loss',
      field: 'totalLoss',
    },
    {
      header: 'Original Cashback',
      field: 'originalCashback',
    },
    {
      header: 'Actual Cashback',
      field: 'actualCashback',
    },
    {
      header: 'Note',
      field: 'remark',
    },
    {
      header: 'Auditor',
      field: 'createdBy',
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter'
    },
  ];

  tr: any = [
    'createdDate',
    'username',
    'groupName',
    'cashbackTitle',
    'isAutoCashback',
    'totalLoss',
    'originalCashback',
    'actualCashback',
    'remark',
    'createdBy',
    'status',

  ];
  dataInput = [];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';
  constructor(
    private router: Router,
    private httpService: BaseService
  ) { }
  // createdDate
  // username
  // groupName
  // cashbackTitle
  // isAutoCashback
  // totalLoss
  // originalCashback
  // actualCashback
  // remark
  // createdBy
  // status
  ngOnInit(): void {
    this.getAllList();
  }

  getAllList() {
    this.httpService.doGet(URL.GET_ALL).subscribe(res => {
      console.log(res.data);
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.map(data => {
          return {
            createdDate: data.createdDate,
            username: data.username,
            groupName: data.groupName,
            cashbackTitle: data.cashbackTitle,
            isAutoCashback: data.isAutoCashback,
            isAutoRebate: data.isAutoRebate = true ? "Yes" : "No",
            totalLoss: data.totalLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            originalCashback: data.originalCashback.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            actualCashback: data.actualCashback.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            remark: data.remark,
            createdBy: data.createdBy,
            status: data.status = true ? "Approved" : "Declined",
          }
        })
      }
    });
  }

  syncCashback() {
    this.httpService.doGet(URL.GET_CAL).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        alert(res.status)
        this.getAllList();
      }
    })
  }
}
