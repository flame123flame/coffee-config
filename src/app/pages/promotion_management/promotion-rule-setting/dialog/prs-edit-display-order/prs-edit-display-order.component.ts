import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-prs-edit-display-order',
  templateUrl: './prs-edit-display-order.component.html',
  styleUrls: ['./prs-edit-display-order.component.scss']
})
export class PrsEditDisplayOrderComponent implements OnInit {
  columns: any = [
    {
      header: 'Order',
      field: 'order',
    },
    {
      header: 'Promotion Name',
      field: 'promotionName',
    },
    {
      header: 'Promotion Type',
      field: 'promotionType',
    },
    {
      header: 'Promotion Category',
      field: 'promotionCategory',
    },
    {
      header: 'Promotion Date',
      field: 'promotionDate',
      type: 'textCenter'
    }
  ];
  data: any = [
    {
      order: 'new',
      promotionName:'โบนัสแรกเข้าคาสิโนสก 100%',
      promotionType: '1st & 2rd Deposit',
      promotionCategory: 'First Depo',
      promotionDate: moment('2020-08-01 12:12:12').format('DD/MM/YYYY HH:mm:ss'),

    },
  ];


  displayedColumns: string[] = ['order','promotionName', 'promotionType', 'promotionCategory', 'promotionDate'];
  constructor() { }

  ngOnInit(): void {
  }

}
