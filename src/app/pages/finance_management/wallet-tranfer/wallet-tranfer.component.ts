import { BaseService } from 'src/app/service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginateFilter, PaginateRequest } from 'src/app/models/PaginateRequest';
import * as moment from 'moment';
import { PageChangeModel } from 'src/app/models/MatTableChange';

const URL = {
  GET_PAGINATE: 'wallet-tranfer/get-paginate'
}


interface tableAll {
  'tb.id': string;
  'tb.orderId': string;
  'tb.username': string;
  'tb.transfer_amount': string;
  'tb.from_wallet': string;
  'tb.to_wallet': number;
  'tb.created_by': number;
  'tb.created_date': string;
  'tb.status': string;
  data: any;
}
@Component({
  selector: 'app-wallet-tranfer',
  templateUrl: './wallet-tranfer.component.html',
  styleUrls: ['./wallet-tranfer.component.scss'],
})
export class WalletTranferComponent implements OnInit {
  columns: any = [
    { header: 'Player ID', field: 'tb.id', },
    { header: 'Tranfer Amount', field: 'tb.transfer_amount', type: 'textNumber' },
    { header: 'From', field: 'tb.from_wallet', },
    { header: 'To', field: 'tb.to_wallet', },
    { header: 'Action By', field: 'tb.username', },
    { header: 'Create On', field: 'tb.created_date' },
    { header: 'Tranfer ID', field: 'tb.orderId', },
  ];

  formFilter: FormGroup;
  paginateReq: PaginateRequest = new PaginateRequest();

  tr: any = [
    'tb.id',
    'tb.transfer_amount',
    'tb.from_wallet',
    'tb.to_wallet',
    'tb.username',
    'tb.created_date',
    'tb.orderId',
  ];
  data: any = [];
  selected = '1';
  length: any

  constructor(
    private httpBase: BaseService,
    private router: Router,
    private fromBuilder: FormBuilder
  ) { 
    this.createForm()
  }

  ngOnInit(): void {
    
    this.getPaginate()
  }

  getPaginate() {

    this.data = [];
    let wordFilter: PaginateFilter = new PaginateFilter();
    this.paginateReq.filter = [];
    if (this.formFilter.controls.username.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.username';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.username.value;
      this.paginateReq.filter.push(wordFilter);
    }

    if (this.formFilter.controls.transferId.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.order_id';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.transferId.value;
      this.paginateReq.filter.push(wordFilter);
    }

    if(this.formFilter.controls.dateEnd.value || this.formFilter.controls.dateStart.value)
    {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.created_date';
      wordFilter.op = 'between';
      wordFilter.value = moment(this.formFilter.controls.dateStart.value).format('YYYY/MM/DD HH:mm:ss');
      wordFilter.value1 = moment(this.formFilter.controls.dateEnd.value).format('YYYY/MM/DD HH:mm:ss');
      this.paginateReq.filter.push(wordFilter);
    }

    if(this.formFilter.controls.transferAmountStart.value || this.formFilter.controls.transferAmountEnd.value)
    {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.transfer_amount';
      wordFilter.op = 'between';
      wordFilter.value = this.formFilter.controls.transferAmountStart.value;
      wordFilter.value1 = this.formFilter.controls.transferAmountEnd.value;
      this.paginateReq.filter.push(wordFilter);
    }


    
    this.httpBase.doPost(URL.GET_PAGINATE, this.paginateReq).subscribe(res => {
      if (res.status === 'SUCCESS') {
        const arr: tableAll[] = [];
        res.data.data.forEach(element => {
          arr.push({
            'tb.id': element.id,
            'tb.username': element.username,
            'tb.status': element.status,
            'tb.created_by': element.createdBy,
            'tb.created_date': moment(element.createdDate).format('DD/MM/YYYY HH:mm:ss'),
            'tb.orderId': element.orderId,
            'tb.transfer_amount': element.transferAmount,
            'tb.from_wallet': element.fromWallet,
            'tb.to_wallet': element.toWallet,
            data: element
          });
        });
        this.data = arr;
        console.log(this.data);
        this.length = res.data.recordsTotal;
      }
    })
  }

  searchPaginate() {
    console.log(this.formFilter.value)
    this.getPaginate();
  }

  createForm() {
    this.formFilter = this.fromBuilder.group({
      username: '',
      transferAmountStart: '',
      transferAmountEnd:'',
      dateStart: null,
      dateEnd:null,
      transferId: '',
      // installmentSearch: [null],
      // transactionGroupSearch: [null]
    });
  }

  resetSearch()
  {
    this.createForm()
    this.getPaginate()
  }

  pageAllChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex;
    this.paginateReq.length = event.pageSize;
    this.getPaginate();
  }

}
