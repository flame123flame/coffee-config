import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-agent-team-report',
  templateUrl: './agent-team-report.component.html',
  styleUrls: ['./agent-team-report.component.scss']
})
export class AgentTeamReportComponent implements OnInit {
  columns = [
    {
      header: 'Agent ID/Real Name',
      field: 'Agent',
    },
    {
      header: 'Agent Level',
      field: 'AgentLevel',
    },
    {
      header: 'Downlines',
      field: 'downlines',
    },
    {
      header: 'New Registrant',
      field: 'nr',
    },

    {
      header: 'Total Players',
      field: 'totalPlayers',
    },
    {
      header: 'Deposit Sequence',
      field: 'ds',
    },
    {
      header: 'Deposit/#First Deposit',
      field: 'dfd',
    },
    {
      header: 'Deposit Amt.',
      field: 'da',
    },
    {
      header: 'Withdrawal Amt.',
      field: 'wdwa',
    },
  ];

  dataInput = [
    {
      Agent: '',
      AgentLevel: '',
      downlines: '',
      nr: '',
      totalPlayers: '',
      ds: '',
      dfd: '',
      da: '',
      wdwa: '',
      action: '',
    },
  ];
  tr: any = [
    'Agent',
    'AgentLevel',
    'downlines',
    'nr',
    'totalPlayers',
    'ds',
    'dfd',
    'da',
    'wdwa',
    'action',
  ];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';
  selected6 = '2';
  startDate = '';
  endDate = '';
  constructor() { }

  ngOnInit(): void {
    this.today()
  }
  today() {
    this.startDate = moment().format('YYYY-MM-DD dddd');
    this.startDate = this.startDate + ' 00:00:00'
    this.endDate = moment().format('YYYY-MM-DD dddd');
    this.endDate = this.endDate + ' 23:59:59'
  }
  toDate() {
    this.startDate = ''
    this.endDate = ''
  }
}
