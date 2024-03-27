import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-rebate-history',
  templateUrl: './rebate-history.component.html',
  styleUrls: ['./rebate-history.component.scss'],
})
export class RebateHistoryComponent implements OnInit {
  columns: any = [
    {
      header: 'Process Date',
      field: 'date',
      type: 'textCenter'
    },
    {
      header: 'Player ID',
      field: 'playerId',
    },
    {
      header: 'Currency',
      field: 'currency',
    },
    {
      header: 'Player Group',
      field: 'group',
    },
    {
      header: 'Rebate Title',
      field: 'rebate',
    },
    {
      header: 'Valid Bets',
      field: 'validBets',
      type: 'textNumber'
    },
  ];

  tr: any = [
    'date',
    'playerId',
    'currency',
    'group',
    'rebate',
    'validBets',
    'action',
  ];
  data: any = [
    {
      date: moment('2020-08-25 15:40').format('DD/MM/YYYY HH:mm:ss'),
      playerId: 'Player1 - P00646',
      currency: 'THB',
      group: 'DEFAULT VIP GROUP',
      rebate: 'ค่าคอมสล๊อต VIP1 - สมาชิกทั่วไป',
      validBets: '270,356,112.36',
    },
    {
      date: moment('2020-08-25 15:40').format('DD/MM/YYYY HH:mm:ss'),
      playerId: 'Player2 - P00647',
      currency: 'THB',
      group: 'DEFAULT VIP GROUP',
      rebate: 'ค่าคอมสล๊อต VIP1 - สมาชิกทั่วไป',
      validBets: '7,386,556.50',
    },
    {
      date: moment('2020-08-25 15:40').format('DD/MM/YYYY HH:mm:ss'),
      playerId: 'Player3 - P00648',
      currency: 'THB',
      group: 'DEFAULT VIP GROUP',
      rebate: 'ค่าคอมสล๊อต VIP1 - สมาชิกทั่วไป',
      validBets: '800,900,321.00',
    },
    {
      date: moment('2020-08-25 15:40').format('DD/MM/YYYY HH:mm:ss'),
      playerId: 'Player4 - P00649',
      currency: 'THB',
      group: 'DEFAULT VIP GROUP',
      rebate: 'ค่าคอมสล๊อต VIP1 - สมาชิกทั่วไป',
      validBets: '401,190.32',
    },
    {
      date: moment('2020-08-25 15:40').format('DD/MM/YYYY HH:mm:ss'),
      playerId: 'Player5 - P00650',
      currency: 'THB',
      group: 'DEFAULT VIP GROUP',
      rebate: 'ค่าคอมสล๊อต VIP1 - สมาชิกทั่วไป',
      validBets: '170.00',
    },
    {
      date: moment('2020-08-25 15:40').format('DD/MM/YYYY HH:mm:ss'),
      playerId: 'Player6 - P00651',
      currency: 'THB',
      group: 'DEFAULT VIP GROUP',
      rebate: 'ค่าคอมสล๊อต VIP1 - สมาชิกทั่วไป',
      validBets: '605,087.32',
    },
  ];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';

  constructor() { }

  ngOnInit(): void { }
}
