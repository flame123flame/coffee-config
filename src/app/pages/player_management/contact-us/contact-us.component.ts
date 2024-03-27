import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../service/message.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import * as moment from 'moment';
const URL = {
  GET_CONTACTUS_PAGINATE: 'contact-us/get-contact-us',
  EXPORT_EXCEL: '/contact-us/export-data'
}
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  columns = [
    { header: 'Username', field: 'username', },
    { header: 'Real Name', field: 'realName', },
    { header: 'Group Name', field: 'groupName', },
    { header: 'Mobile Phone', field: 'mobilePhone' },
    { header: 'E-mail', field: 'email' },
    { header: 'Bank Code', field: 'bankCode' },
    { header: 'Bank Account', field: 'bankAccount', type: 'textCenter' },
    { header: 'Bank Status', field: 'bankStatus', type: 'textCenter' },
    { header: 'Withdraw Count', field: 'withdrawCount' },
    { header: 'Registered Date', field: 'registeredDate' },
    { header: 'Last Login', field: 'lastLogin' },
    { header: 'Deposit Count', field: 'depositCount' },
    { header: 'Created Date', field: 'createdDate' },
    { header: 'Status', field: 'status', type: 'textCenter' },
  ]

  dataInput = [];
  tr: any = this.columns.map((data) => {
    return data.field;
  });
  dataLength: number = 0;
  dataPG: PaginateRequest = new PaginateRequest();

  constructor(
    private httpService: BaseService,
    private router: Router,
    @Inject('API_URL') public api_url: string,
  ) { }

  ngOnInit(): void {
    this.getContactUs()
  }

  getContactUs() {
    this.httpService.doPost(URL.GET_CONTACTUS_PAGINATE, this.dataPG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data.data.map(data => {
          return {
            username: data.username,
            realName: data.realName,
            groupName: data.groupName,
            mobilePhone: data.mobilePhone,
            email: data.email,
            bankCode: data.bankCode,
            bankAccount: data.bankAccount,
            bankStatus: data.bankStatus,
            withdrawCount: data.withdrawCount,
            registeredDate: moment(data.registeredDate).format('DD/MM/YYYY HH:mm:ss'),
            lastLogin: moment(data.lastLogin).format('DD/MM/YYYY HH:mm:ss'),
            depositCount: data.depositCount,
            createdDate: moment(data.createdDate).format('DD/MM/YYYY HH:mm:ss'),
            status: data.status,

          }
        })
        this.dataLength = res.data.recordsTotal
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message)
      }
      this.dataPG.filter = []
    })
  }


  pageChange(event: PageChangeModel) {
    this.dataPG.page = event.pageIndex
    this.dataPG.length = event.pageSize
    this.getContactUs();
  }

  sortChange(event: SortChangeModel) {
    this.dataPG.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.dataPG.sort.push(sort)
    }
    this.getContactUs();
  }
  exportExcel() {
    window.open(this.api_url + URL.EXPORT_EXCEL)
  }
}
