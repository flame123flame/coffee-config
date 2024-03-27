import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sports-valid-bets',
  templateUrl: './sports-valid-bets.component.html',
  styleUrls: ['./sports-valid-bets.component.scss']
})
export class SportsValidBetsComponent implements OnInit {
  columns: any = [
    {
      header: 'Odds Type',
      field: 'oddsType',
    },
    {
      header: 'Odds',
      field: 'odds',
      type: 'textNumber'
    },
    {
      header: 'Odds Type',
      field: 'oddsType1',
    },
    {
      header: 'Odds',
      field: 'odds1',
      type: 'textNumber'
    },
  ];

  tr: any = [
    'oddsType',
    'odds',
    'oddsType1',
    'odds1',
  ];
  data: any = [
    {
      oddsType: 'Decimal/Euro',
      odds: '1.60',
      oddsType1: 'Indo',
      odds1: '-1.66',
    },
    {
      oddsType: 'Fractional',
      odds: '3/5',
      oddsType1: 'Malay',
      odds1: '0.60',
    },
    {
      oddsType: 'HK',
      odds: '0.60',
      oddsType1: 'US',
      odds1: '-166.66',
    },
   
  ];
  selected = '1';
  constructor() { }

  ngOnInit(): void {
  }

}
