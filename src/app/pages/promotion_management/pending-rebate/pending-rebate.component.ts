import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending-rebate',
  templateUrl: './pending-rebate.component.html',
  styleUrls: ['./pending-rebate.component.scss'],
})
export class PendingRebateComponent implements OnInit {
  columns: any = [
    {
      header: 'Rebate Title',
      field: 'title',
    },
    {
      header: 'Currency',
      field: 'currency',
    },
    {
      header: 'Product Type',
      field: 'productType',
    },
    {
      header: 'Auto Rebate',
      field: 'autoRebate',
    },
    {
      header: 'Rebate Condition',
      field: 'condition',
    },
    {
      header: 'Date Period',
      field: 'datePeriod',
    },
    {
      header: 'Player',
      field: 'player',
    },
    {
      header: 'Valid Bets',
      field: 'validBets',
    },
    {
      header: 'Rebate',
      field: 'rebate',
    },
  ];

  tr: any = [
    'title',
    'currency',
    'productType',
    'autoRebate',
    'condition',
    'datePeriod',
    'player',
    'validBets',
    'rebate',
  ];
  data: any = [
    {
      title: '',
      currency: '',
      productType: '',
      autoRebate: '',
      condition: '',
      datePeriod: '',
      player: '',
      validBets: '',
      rebate: '',
    },
  ];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  constructor() {}

  ngOnInit(): void {}
}
