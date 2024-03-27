import { Component, OnInit } from '@angular/core';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-rebate-setting',
  templateUrl: './rebate-setting.component.html',
  styleUrls: ['./rebate-setting.component.scss'],
})
export class RebateSettingComponent implements OnInit {
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add', onClick: () => {
        this.router.navigate(["promotion-management/rebate-setting/rebate-setting-add"]);
      }
    },
  ];
  columns: any = [
    {
      header: 'Rebate Title',
      field: 'title',
      type: 'link',
    },
    {
      header: 'Currency',
      field: 'currency',
    },
    {
      header: 'Product Type',
      field: 'productType',
    },
    {
      header: 'Effective Date',
      field: 'effectivaDate',
      type: 'textCenter'
    },
    {
      header: 'Auto Rebate',
      field: 'autoRebate',
    },
    {
      header: 'Rebate Terms',
      field: 'rebateTerms',
    },
    {
      header: 'Max. Group Rebate',
      field: 'group',
      type: 'textNumber'
    },
    {
      header: 'Rebate Type',
      field: 'rebateType',
    },
  ];

  tr: any = [
    'title',
    'currency',
    'productType',
    'effectivaDate',
    'autoRebate',
    'rebateTerms',
    'group',
    'rebateType',
    'action',
  ];
  data: any = [
    {
      title: {
        url: '',
        title: 'คืนเงินสล๊อตรายวัน',
      },
      currency: 'THB',
      productType: 'RNG Games',
      effectivaDate: moment('2019-03-29 12:30:38').format('DD/MM/YYYY HH:mm:ss'),
      autoRebate: 'No',
      rebateTerms: 'Daily',
      group: '6,000.00',
      rebateType: 'Valid Bets',
    },
    {
      title: {
        url: '',
        title: 'Casino Rebate (march 2018)',
      },
      currency: 'THB',
      productType: 'Live Games',
      effectivaDate: moment('2018-03-26 18:48:37').format('DD/MM/YYYY HH:mm:ss'),
      autoRebate: 'No',
      rebateTerms: 'Daily',
      group: '7,500.00',
      rebateType: 'Valid Bets',
    },
    {
      title: {
        url: '',
        title: 'sports rebate (season 18-19)',
      },
      currency: 'THB',
      productType: 'Sportsbook',
      effectivaDate: moment('2018-07-28 02:49:42').format('DD/MM/YYYY HH:mm:ss'),
      autoRebate: 'No',
      rebateTerms: 'Daily',
      group: '12,000.00',
      rebateType: 'Valid Bets',
    },
  ];

  radio1 = '1';
  radio2 = '1';
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  constructor(private router: Router) { }

  ngOnInit(): void { }
}
