import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-account-log',
  templateUrl: './company-account-log.component.html',
  styleUrls: ['./company-account-log.component.scss']
})
export class CompanyAccountLogComponent implements OnInit {

  bankNameList: string[] = ['ทรูวอลเล็ต', 'Bangkok Bang', 'Bank of Ayudhya', 'GSB']
  columns: any = [
    { header: 'Process On', field: 'processOn' },
    { header: 'Bank Information', field: 'bankInformation' },
    { header: 'Account Information', field: 'accountInformation' },
    { header: 'Change', field: 'change' },
    { header: 'IP Address', field: 'ipAddress' },
    { header: 'Process', field: 'process' },
  ];

  tr: any = [
    'processOn',
    'bankInformation',
    'accountInformation',
    'change',
    'ipAddress',
    'process'
  ];
  data: any = [
    {
      processOn: '2020-18-11 16:50:12',
      bankInformation: 'Kasikorn Bank THB',
      accountInformation: 'สมัย ภู่แก้ว 07711808759',
      change: 'meet max deposit limit',
      ipAddress: 'N/A',
      process: 'tanachat',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
