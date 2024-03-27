import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rebate-setting-add',
  templateUrl: './rebate-setting-add.component.html',
  styleUrls: ['./rebate-setting-add.component.scss']
})
export class RebateSettingAddComponent implements OnInit {

  constructor() { }
  selected1 = '1'
  selected2 = '1'
  selected3 = '1'
  selected4 = '1'
  selected5 = '1'
  selected6 = '1'
  selected7 = '1'
  radio1 = '1'
  columns: any = [
    {
      header: 'Game Provider',
      field: 'gameProvider',
    },
    {
      header: 'Game Group',
      field: 'gameGroup',
    },
    {
      header: 'Min. Valid Bets',
      field: 'mvb',
      type: 'input'
    },
    {
      header: 'Rebate%(Recommended =< 1)',
      field: 'rbr',
      type: 'input'
    },
    {
      header: 'Max. Rebate (0 is unlimited)',
      field: 'mru',
      type: 'input'
    },
  ];

  tr: any = [
    'select',
    'gameProvider',
    'gameGroup',
    'mvb',
    'rbr',
    'mru',
    'action',
  ];
  data: any = [
    {
      check: '',
      gameProvider: 'SV',
      gameGroup: 'COCKFIGHT',
      mvb: '',
      rbr: '',
      mru: '',
      action: ''
    },
    {
      check: '',
      gameProvider: 'TRC',
      gameGroup: 'HORSEBOOK',
      mvb: '',
      rbr: '',
      mru: '',
      action: ''
    },
  ];
  ngOnInit(): void {
  }

}
