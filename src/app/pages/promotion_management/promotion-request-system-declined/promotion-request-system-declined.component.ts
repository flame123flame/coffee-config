import { Component, OnInit } from '@angular/core';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Router } from '@angular/router';
@Component({
  selector: 'app-promotion-request-system-declined',
  templateUrl: './promotion-request-system-declined.component.html',
  styleUrls: ['./promotion-request-system-declined.component.scss']
})
export class PromotionRequestSystemDeclinedComponent implements OnInit {

  constructor(private router: Router) { }
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Promotion Reqiets List', onClick: () => {
        this.router.navigate(["promotion-management/promotion-request"]);
      }
    },
  ];
  columns: any = [
    {
      header: 'Player Group',
      field: 'group',
    },
    {
      header: 'Player ID',
      field: 'playerId',
      type: 'link',
    },
    {
      header: 'Promotion Name',
      field: 'promoName',
    },
    {
      header: 'Promotion Type',
      field: 'promoType',
    },
    {
      header: 'Bonus Amount',
      field: 'bonus',
      type: 'textNumber'
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter'
    },
  ];

  tr: any = [
    'group',
    'playerId',
    'promoName',
    'promoType',
    'bonus',
    'status',
    'action',
  ];
  data: any = [
    {
      group: 'โบนัส 100% คาสิโน',
      playerId: {
        url: '',
        title: 'Player1 - P00646',
      },
      promoName: 'โบนัสแรกเข้าคาสิโน',
      promoType: '1st & 2nd Deposit',
      bonus: '1,500.00',
      status: 'Approve',
    }
  ];
  selected1 = '1'
  selected2 = '1'
  selected3 = '1'
  ngOnInit(): void {
  }

}
