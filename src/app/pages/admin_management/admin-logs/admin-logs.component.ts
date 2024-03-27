import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.scss']
})
export class AdminLogsComponent implements OnInit {
  columns = [
    {
      header: 'Username',
      field: 'username',
    },
    {
      header: 'date',
      field: 'date',
    },
    {
      header: 'Change',
      field: 'change',
    },
    {
      header: 'IP Address',
      field: 'ipAddress',
    },
    {
      header: 'Update By',
      field: 'updateBy',
    }
  ]
  dataInput = [
    {
      username: 'btest12',
      date: '2020-08-18 16:47:23',
      change: 'Login successful (loginip: 184.82.206.85/32)',
      ipAddress: '184.82.206.85',
      updateBy: 'btest12',
    },
    {
      username: 'btest12',
      date: '2020-08-18 16:46:54',
      change: 'Login successful (loginip: 184.82.206.85/32)',
      ipAddress: '184.82.206.85',
      updateBy: 'btest12',
    },
    {
      username: 'ckjjay',
      date: '2020-08-18 16:45:52',
      change: 'Login successful',
      ipAddress: '171.96.75.33',
      updateBy: 'ckjjay',
    },
  ];

  tr: any = [
    'username',
    'date',
    'change',
    'ipAddress',
    'updateBy',
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
