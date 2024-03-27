import { Component, OnInit } from '@angular/core';
import { MenuDropdownItem } from './../../../models/MenuDropdownItem';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IpRuleAddComponent } from './dialog/ip-rule-add/ip-rule-add.component';
import * as moment from 'moment';
@Component({
  selector: 'app-ip-rule',
  templateUrl: './ip-rule.component.html',
  styleUrls: ['./ip-rule.component.scss']
})
export class IpRuleComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }
  listItemMenu: Array<MenuDropdownItem> = [
    {
      text: 'Add', onClick: () => {
        this.openDialog();
      }
    },
  ];
  columns = [
    {
      header: 'IP Address',
      field: 'ipAddress',
    },
    {
      header: 'Status',
      field: 'status',
      type: 'textCenter'
    },
    {
      header: 'Date',
      field: 'date',
      type: 'textCenter'
    },
    {
      header: 'Remarks',
      field: 'remark',
    },

  ];

  dataInput = [
    {
      ipAddress: '111.250.129.180',
      status: 'Allowed',
      date: moment('2019-12-28 16:53:34').format('DD/MM/YYYY HH:mm:ss'),
      remark: '',
      action: '',
    },
  ];

  tr: any = [
    'ipAddress',
    'status',
    'date',
    'remark',
    'action',

  ];
  radio1 = 'All';
  ngOnInit(): void {
  }
  openDialog() {
    this.dialog.open(IpRuleAddComponent, { width: '500px' });
  }
}
