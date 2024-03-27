import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-product-maintenance',
  templateUrl: './product-maintenance.component.html',
  styleUrls: ['./product-maintenance.component.scss']
})
export class ProductMaintenanceComponent implements OnInit {
  columns: any = [
    {
      header: 'Game Provider',
      field: 'gameProvider',
    },
    {
      header: 'Product Type',
      field: 'productType',
    },
    {
      header: 'Period',
      field: 'perriod',
    },
    {
      header: 'Last Update',
      field: 'lastUpdate',
      type: 'textCenter'
    },
  ];

  tr: any = [
    'gameProvider',
    'productType',
    'dropdown',
    'apply',
    'status-slide-toggle',
    'lastUpdate',
  ];

  data: any = [
    {
      gameProvider: 'AE_LOT',
      productType: 'Lottery',
      // perriod: 'X',
      lastUpdate: moment('2018-06-16 12:12').format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      gameProvider: '',
      productType: 'RNG Game',
      // perriod: 'X',
      lastUpdate: moment('2018-05-6 12:12').format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      gameProvider: 'SA',
      productType: 'Live Game',
      // perriod: 'X',
      lastUpdate: moment('2018-04-10 12:12').format('DD/MM/YYYY HH:mm:ss'),
    },

  ];
  selected = '1';

  displayedColumns: string[] = ['gameProviderProductType', 'period1', 'period', 'btn', 'status', 'lastUpdate'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }
}

export interface PeriodicElement {
  gameProviderProductType: string;
  period: string;
  period1: string;
  btn: string;
  status: string;
  lastUpdate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {gameProviderProductType: 'AE_LOT - Lottery', period1: '', period: '', btn: '', status : '', lastUpdate: moment('2018-11-06').format('DD/MM/YYYY')},


];