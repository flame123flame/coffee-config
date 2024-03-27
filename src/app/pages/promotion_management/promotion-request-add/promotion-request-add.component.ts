import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BaseService } from 'src/app/service/BaseService.service';

@Component({
  selector: 'app-promotion-request-add',
  templateUrl: './promotion-request-add.component.html',
  styleUrls: ['./promotion-request-add.component.scss']
})
export class PromotionRequestAddComponent implements OnInit {

  
  columns1: any = [
    {
      header: 'Date',
      field: 'date',
      type: 'textCenter'
    },
    {
      header: 'Promotion Name',
      field: 'promotionName',
    },
    {
      header: 'Promotion Type',
      field: 'promotionType',
    },
    {
      header: 'Bonus Amt.',
      field: 'bonusAmt',
      type: 'pipeNumber'
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter'
    },
    {
      header: 'Action By',
      field: 'actionBy',
    },
  ];

  tr1: any = [
    'date',
    'promotionName',
    'promotionType',
    'bonusAmt',
    'status',
    'actionBy',
  ];
  data1: any = [
    {
      date: moment('2018-12-22 22:55:44').format('DD/MM/YYYY HH:mm:ss'),
      promotionName: 'โปรโมชั้นแจกฟรี 3,000 บาท',
      promotionType: 'Registration',
      bonusAmt: 100,
      status: 'Approved',
      actionBy: 'linyamaomine',
    },
  ];

  columns2: any = [
    {
      header: 'Date',
      field: 'date',
      type: 'textCenter'
    },
    {
      header: 'Condition Tyep',
      field: 'conditionType',
    },
    {
      header: 'Deposit Amount',
      field: 'depositAmount',
      type: 'textNumber'
    },
    {
      header: 'Bonus Amt.',
      field: 'bonusAmt',
      type: 'textNumber'
    },
    {
      header: 'Product Type',
      field: 'productType',
    },
    {
      header: 'Valid Bets Condition',
      field: 'validBetsCondition',
      type: 'textNumber'
    },
    {
      header: 'Valid Bets',
      field: 'validBets',
      type: 'textNumber'
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter'
    },
    {
      header: 'Pass?',
      field: 'pass',
    },
    {
      header: 'Action By',
      field: 'actionBy',
    },
  ];

  tr2: any = [
    'date',
    'conditionType',
    'depositAmount',
    'bonusAmt',
    'productType',
    'validBetsCondition',
    'validBets',
    'status',
    'pass',
    'actionBy',
  ];
  data2: any = [
    {
      date: moment('2018-12-24 19:02:35').format('DD/MM/YYYY HH:mm:ss'),
      conditionType: 'Game Rebat',
      depositAmount: '0.00',
      bonusAmt: '1.29',
      productType: 'All',
      validBetsCondition: '1.29',
      validBets: '0.00',
      status: 'Created',
      pass: 'Not Pass',
      actionBy: '',
    },
    {
      date: moment('2018-12-22 22:54:01').format('DD/MM/YYYY HH:mm:ss'),
      conditionType: 'Reqistration',
      depositAmount: '0.00',
      bonusAmt: '100.00',
      productType: 'SV Animal',
      validBetsCondition: '1,000.00',
      validBets: '191.00',
      status: 'Created',
      pass: 'Not Pass',
      actionBy: '',
    },
  ];
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  playerList = [];
  constructor(private router: Router, private baseService: BaseService) {
    this.playerReqList();
  }
  ngOnInit(): void { }
  playerReqList() {
    this.baseService.doGet('customer/get-customer-all').subscribe(res => {
      console.log(res);
      if (res.status === 'SUCCESS' && res.data.length != 0) {
        this.playerList = res.data;

      }
    });
  }
}
