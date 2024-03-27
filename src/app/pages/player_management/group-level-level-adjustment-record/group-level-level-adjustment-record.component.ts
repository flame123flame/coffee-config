import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-level-level-adjustment-record',
  templateUrl: './group-level-level-adjustment-record.component.html',
  styleUrls: ['./group-level-level-adjustment-record.component.scss']
})
export class GroupLevelLevelAdjustmentRecordComponent implements OnInit {
  columns: any = [
    {
      header: 'Updated Time',
      field: 'updatedTime',
    },
    {
      header: 'Player ID',
      field: 'playerId',
    },
    {
      header: 'Currency',
      field: 'currency',
    },
    {
      header: 'Type',
      field: 'type',
    },
    {
      header: 'Before Level',
      field: 'beforeLevel',
    },
    {
      header: 'Affter Level',
      field: 'affterLevel',
    },
    {
      header: 'Action By',
      field: 'actionBy',
    },
  ];

  tr: any = [
    'no',
    'updatedTime',
    'playerId',
    'currency',
    'type',
    'beforeLevel',
    'affterLevel',
    'actionBy',
  ];
  data: any = [
    // {
    // updatedTime: '',
    // playerId: '',
    // currency: '',
    // type: '',
    // beforeLevel: '',
    // affterLevel: '',
    // actionBy: '',
    // },
  
  ];
  currencyOptions: String[] = ['All', 'THB', 'USD', 'EUR'];
  beforeLevelOptions: String[] = ['All', 'โบนัส 10% คาสิโน - โบนัส 10% คาสิโน', 'โบนัส 100% คาสิโน - โบนัส 100% คาสิโน'];
  affterLevelOptions: String[] = ['All', 'โบนัส 10% คาสิโน - โบนัส 10% คาสิโน', 'โบนัส 100% คาสิโน - โบนัส 100% คาสิโน'];
  playerIdOptions: String[] = ['Layzy', 'Fuzzy', 'Boa'];
  TypeOptions: String[] = ['All', 'Auto', 'Manual'];
  constructor() { }

  ngOnInit(): void {
  }

}
