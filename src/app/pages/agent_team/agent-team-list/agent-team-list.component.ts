import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-team-list',
  templateUrl: './agent-team-list.component.html',
  styleUrls: ['./agent-team-list.component.scss']
})
export class AgentTeamListComponent implements OnInit {
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
      header: 'Real Name',
      field: 'AgentTeam',
    },
    {
      header: 'Registered Date',
      field: 'registeredDate',
    },
    {
      header: 'Downlines',
      field: 'downlines',
    },
    {
      header: 'Total Players',
      field: 'totalPlayers',
    },
    {
      header: 'Status',
      field: 'Status',
    },
    {
      header: 'Last Update',
      field: 'lastUpdate',
    },
    {
      header: 'Update By',
      field: 'updateBy',
    },

  ];

  dataInput = [
    {
      AgentLevel: '',
      AgentTeam: '',
      registeredDate: '',
      downlines: '',
      totalPlayers: '',
      Status: '',
      lastUpdate: '',
      updateBy: '',
      action: '',
    },
  ];
  tr: any = [
    'AgentLevel',
    'AgentTeam',
    'registeredDate',
    'downlines',
    'totalPlayers',
    'Status',
    'lastUpdate',
    'updateBy',
    'action',
  ];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  onClick() {
    this.router.navigate(["agent-team/team-list/team-list-add"]);
  }
}
