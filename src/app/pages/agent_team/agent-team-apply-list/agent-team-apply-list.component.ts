import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agent-team-apply-list',
  templateUrl: './agent-team-apply-list.component.html',
  styleUrls: ['./agent-team-apply-list.component.scss'],
})
export class AgentTeamApplyListComponent implements OnInit {
  columns = [
    {
      header: 'Agent ID',
      field: 'Agent',
    },
    {
      header: 'Real Name',
      field: 'AgentTeam',
    },
    {
      header: 'Mobile',
      field: 'AffliateID',
    },
    {
      header: 'Requested Date',
      field: 'PlayerID',
    },
    {
      header: 'Audit Datem1',
      field: 'UplinePlayerID',
    },
    {
      header: 'Status',
      field: 'TotalDownline',
    },
    {
      header: 'Aiditor',
      field: 'EffectiveDownline',
    },
    {
      header: 'Actions',
      field: 'TotalOneTimeBonus',
    },
    {
      header: 'Remark',
      field: 'action001',
    },
  ];

  dataInput = [
    {
      Agent: '',
      AgentTeam: '',
      AffliateID: '',
      PlayerID: '',
      UplinePlayerID: '',
      TotalDownline: '',
      EffectiveDownline: '',
      TotalOneTimeBonus: '',
      action001: '',
    },
  ];
  tr: any = [
    'Agent',
    'AgentTeam',
    'AffliateID',
    'PlayerID',
    'UplinePlayerID',
    'TotalDownline',
    'EffectiveDownline',
    'TotalOneTimeBonus',
    'action001',
  ];
  selected1='1';
  selected2='1';
  constructor() {}

  ngOnInit(): void {}
}
