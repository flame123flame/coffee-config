import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-concurrent-players',
  templateUrl: './concurrent-players.component.html',
  styleUrls: ['./concurrent-players.component.scss']
})
export class ConcurrentPlayersComponent implements OnInit {

  columns = [
    { header: 'Player Type', field: 'playerType' },
    { header: 'Player ID/Active Since', field: 'PlayerId' },
    { header: 'Currency', field: 'currency' },
    { header: 'Tag Name', field: 'tagName' },
    { header: 'VIP Group', field: 'VIPGroup' },
    { header: 'Balance', field: 'Balance', type: 'textNumber' },
    { header: 'Province / City', field: 'Province' },
    { header: 'Country', field: 'Country' },
    { header: 'IP/FP(finger print)', field: 'IP' },
  ];

  dataInput = [
    {
      playerType: 'Real Player',
      PlayerId: 'player_id / 01/09/2020',
      currency: 'THB',
      tagName: 'SameIP',
      VIPGroup: 'Default',
      Balance: '200.00',
      Province: 'BK',
      Country: 'Thailand',
      IP: '127.0.0.1',
    },
  ];

  tr: any = [
    'playerType',
    'PlayerId',
    'currency',
    'tagName',
    'VIPGroup',
    'Balance',
    'Province',
    'Country',
    'IP',
  ];
  realPlayers:number=43;
  internalPlayers:number=0;
  totalPlayers:number=43;
  constructor() { }

  ngOnInit(): void { }


}
