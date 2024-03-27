import { element } from 'protractor';
import { AddBankDialogComponent } from './add-bank-dialog/add-bank-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PaginateFilter, PaginateRequest } from 'src/app/models/PaginateRequest';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageChangeModel } from 'src/app/models/MatTableChange';
@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss'],
})
export class BankListComponent implements OnInit {
  columns: any = [
    {
      header: '#',
      field: 'id',
    },
    {
      header: 'Bank Name ',
      field: 'bankName',
    },
    {
      header: 'Hot',
      field: 'hot',
    },
    {
      header: 'Display Name',
      field: 'displayName',
    },
    {
      header: 'Image',
      field: 'bankImg',
      type: 'image'
    },
    {
      header: 'Online Banking URL',
      field: 'bankUrl',
      type: 'link',
      onClick: (data) => {
        console.log(data);
        window.open(data.bankUrl.url)
      },
    },
  ];
  dataInput = [];
  formFilter: FormGroup;
  actionSetting: ActionSetting = new ActionSetting({})
  tr: any = [
    'no',
    'bankName',
    'hot',
    'displayName',
    'bankImg',
    // 'bankType',
    // 'currency',
    'bankUrl',
    'action',
  ];
  bankLength: number = 0;
  bankPg: PaginateRequest = new PaginateRequest();
  data: any = [];
  url = "";
  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  constructor(
    private changeDetectorRefs: ChangeDetectorRef, 
    private router: Router, public dialog: MatDialog, 
    private httpService: BaseService,
    private fb: FormBuilder) {this.createFrom()}
  StatusOptions: any[] = [{ name: 'Show', value: 'enable' }, { name: 'Hidden', value: 'enable' }];

  ngOnInit(): void {

    this.loadList();
    // this.loadList2();
  }

  openDialog(data = null): void {
    const dialogRef = this.dialog.open(AddBankDialogComponent, { data: data, width: '600px' });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadList();
    });
  }

  createFrom() {
    this.formFilter = this.fb.group({
      bankCode: [null],
      bankNameEn: [null],
      bankNameTh: [null],
      status: [null]
    })
  }


  loadList() {

    let wordFilter: PaginateFilter = new PaginateFilter();
    this.bankPg.filter=[]
    if (this.formFilter.controls.bankCode.value) {
      wordFilter.column = 'bank_code'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.bankCode.value
      this.bankPg.filter.push(wordFilter)
    }
    wordFilter = new PaginateFilter();
    if (this.formFilter.controls.bankNameEn.value) {
      wordFilter.column = 'bank_name_en'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.bankNameEn.value
      this.bankPg.filter.push(wordFilter)
    }
    wordFilter = new PaginateFilter();
    if (this.formFilter.controls.bankNameTh.value) {
      wordFilter.column = 'bank_name_th'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.bankNameTh.value
      this.bankPg.filter.push(wordFilter)
    }
    wordFilter = new PaginateFilter();
    if (this.formFilter.controls.status.value) {
      wordFilter.column = 'enable'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.status.value
      this.bankPg.filter.push(wordFilter)
    }

    // data.filter = []
    this.bankPg.length = 10
    // data.page = 0
    // data.sort = []

    // wordFilter.column = 'bank_code'
    // wordFilter.op = 'contain'
    // wordFilter.value = 'TMB'
    // data.filter.push(wordFilter)

    this.httpService.doPost('bank/get-bank-all-paginate', this.bankPg).subscribe(data => {
      this.data = [];

      console.log(data);
      if (data.status === 'SUCCESS') {
        data.data.data.forEach((element, index) => {
          this.url = element.bankUrl;
          this.data.push({

            id: element.id,
            bankImg: element.bankImg,
            bankCode: element.bankCode,
            bankName: element.bankNameEn,
            hot: element.enable == true ? 'ON' : 'OFF',
            displayName: element.bankNameTh,
            bankUrl: {
              url: element.bankUrl == null ? '' : element.bankUrl,
              title: element.bankUrl == null || element.bankUrl == '' ? ' ' : element.bankUrl,
            },
          });
          console.log(element.bankUrl);
          
        });
        this.bankLength = data.data.recordsTotal
      } else {
        console.log(data.data);

      }

    })


    // if (this.formFilter.controls.selectCol.value && this.formFilter.controls.keyword.value) {
    //   wordFilter.column = this.formFilter.controls.selectCol.value
    //   wordFilter.op = 'contain'
    //   wordFilter.value = this.formFilter.controls.keyword.value
    //   data.filter.push(wordFilter)
    // }
    // let dateFilter: PaginateFilter = new PaginateFilter();
    // if (this.formFilter.controls.startDate.value) {
    //   dateFilter.column = 'updated_at'
    //   dateFilter.op = '>='
    //   dateFilter.value = this.formFilter.controls.startDate.value
    //   data.filter.push(dateFilter)
    // }
    // let dateFilterEnd: PaginateFilter = new PaginateFilter();

    // if (this.formFilter.controls.endDate.value) {
    //   dateFilterEnd.column = 'updated_at'
    //   dateFilterEnd.op = '<='
    //   dateFilterEnd.value = this.formFilter.controls.endDate.value
    //   data.filter.push(dateFilterEnd)
    // }

    this.changeDetectorRefs.detectChanges();
  }


  editData(z: any) {
    this.openDialog(z)
  }

  reset() {
    this.createFrom();
  }

  onDelete(data) {
    console.log(data.bankCode);
    this.httpService.doDelete("bank/delete-bank/" + data.bankCode).subscribe(data => {
      this.loadList();
    })
  }

  pageBankChange(event: PageChangeModel) {
    this.bankPg.page = event.pageIndex
    this.bankPg.length = event.pageSize
    this.loadList();
  }
}
