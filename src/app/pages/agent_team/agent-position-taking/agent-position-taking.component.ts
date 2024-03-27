import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-agent-position-taking',
  templateUrl: './agent-position-taking.component.html',
  styleUrls: ['./agent-position-taking.component.scss']
})
export class AgentPositionTakingComponent implements OnInit {
  columns = [
    {
      header: 'Agent ID',
      field: 'Agent',
    },
    {
      header: 'Agent Level',
      field: 'AgentLevel',
    },
    {
      header: 'Active player',
      field: 'ap',
    },
    {
      header: 'Own player valid bets',
      field: 'opvb',
    },

    {
      header: 'Own Revenue',
      field: 'orn',
    },
    {
      header: 'Live PT',
      field: 'lpt',
    },
    {
      header: 'EGAME PT',
      field: 'egpt',
    },
    {
      header: 'SPORTS PT',
      field: 'sppt',
    },
    {
      header: 'MPG PT',
      field: 'mpt',
    },
    {
      header: 'ANIMAL SPORTS PT',
      field: 'ansppt',
    },
  ];

  dataInput = [
    {
      Agent: '',
      AgentLevel: '',
      ap: '',
      opvb: '',
      orn: '',
      lpt: '',
      egpt: '',
      sppt: '',
      mpt: '',
      ansppt: '',
    },
  ];
  tr: any = [
    'Agent',
    'AgentLevel',
    'ap',
    'opvb',
    'orn',
    'lpt',
    'egpt',
    'sppt',
    'mpt',
    'ansppt',
  ];
  selected1 = '1';
  selected2 = '1';
  selected3 = '2'
  startDate = '';
  endDate = '';
  constructor() { }

  ngOnInit(): void {
    this.today()
  }
  today() {
    this.startDate = moment().format('YYYY-MM-DD dddd');
    this.endDate = moment().format('YYYY-MM-DD dddd');
  }
  toDate() {
    this.startDate = ''
    this.endDate = ''
  }
}
