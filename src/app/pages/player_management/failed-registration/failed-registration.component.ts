import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-failed-registration',
  templateUrl: './failed-registration.component.html',
  styleUrls: ['./failed-registration.component.scss'],
})
export class FailedRegistrationComponent implements OnInit {
  providerList: Array<string> = [
    'All',
    'AE_LOT',
    'AG',
    'ALLBET',
    'CMDBET',
    'CQ9',
    'DG',
    'GGAMING',
    'MG',
    'MX',
    'PT',
    'SABA',
    'SA_LIVE',
    'SA_RIGN',
    'SBOBET',
    'SV',
    'TRC',
    'URABET',
    'UGAMING',
    'VENUS',
    'VT',
  ];

  columns = [
    {
      header: 'Palyer ID / Real Name',
      field: 'palyerID',
    },
    {
      header: 'AE LOT',
      field: 'AE_LOT',
    },
    {
      header: 'AG',
      field: 'AG',
    },
    {
      header: 'ALLBET',
      field: 'ALLBET',
    },
    {
      header: 'CMDBET',
      field: 'CMDBET',
    },
    {
      header: 'CQ9',
      field: 'CQ9',
    },
    {
      header: 'DG',
      field: 'DG',
    },
    {
      header: 'GGAMING',
      field: 'GGAMING',
    },
    {
      header: 'MG',
      field: 'MG',
    },
    {
      header: 'MX',
      field: 'MX',
    },
    {
      header: 'PT',
      field: 'PT',
    },
    {
      header: 'SABA',
      field: 'SABA',
    },
    {
      header: 'SA_LIVE',
      field: 'SA_LIVE',
    },
    {
      header: 'SA_RIGN',
      field: 'SA_RIGN',
    },
    {
      header: 'SBOBET',
      field: 'SBOBET',
    },
    {
      header: 'SV',
      field: 'SV',
    },
    {
      header: 'TRC',
      field: 'TRC',
    },
    {
      header: 'URABET',
      field: 'URABET',
    },
    {
      header: 'UGAMING',
      field: 'UGAMING',
    },
    {
      header: 'VENUS',
      field: 'VENUS',
    },
    {
      header: 'VT',
      field: 'VT',
    },
  ];

  dataInput = [
    // {
    //   palyerID: '',
    //   AE_LOT: '',
    //   AG: '',
    //   ALLBET: '',
    //   CMDBET: '',
    //   CQ9: '',
    //   DG: '',
    //   GGAMING: '',
    //   MG: '',
    //   MX: '',
    //   PT: '',
    //   SABA: '',
    //   SA_LIVE: '',
    //   SA_RIGN: '',
    //   SBOBET: '',
    //   SV: '',
    //   TRC: '',
    //   URABET: '',
    //   UGAMING: '',
    //   VENUS: '',
    //   VT: '',
    // },
  ];

  tr: any = [
    'select',
    'palyerID',
    'AE_LOT',
    'AG',
    'ALLBET',
    'CMDBET',
    'CQ9',
    'DG',
    'GGAMING',
    'MG',
    'MX',
    'PT',
    'SABA',
    'SA_LIVE',
    'SA_RIGN',
    'SBOBET',
    'SV',
    'TRC',
    'URABET',
    'UGAMING',
    'VENUS',
    'VT',
  ];
  playerStatusOptions: String[] = ['All', 'Active', 'Suspaned', ' Disable'];
  constructor() {}

  ngOnInit(): void {}
}
