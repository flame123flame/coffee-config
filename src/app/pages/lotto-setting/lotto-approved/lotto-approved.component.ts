import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { BeanService } from 'src/app/service/BeanService.service';
import { SocketService } from 'src/app/service/SocketService.service';
import { Router } from '@angular/router';

const URL = {
  GET_DASHBOARD: 'dashboard/get-dashboard',
  GET_CLASS_CODE_BY: 'lotto-class/get-lotto-class',
  GET_LOTTO_RESULT: 'lotto-result/get-lotto-result',
  GET_LOTTO_RESULT_ALL: 'lotto-result/get-all-lotto-result',
  GET_LOTTO_RESULT_INSTALLMENT: 'lotto-result/get-all-lotto-installment'
};
interface lottoClass {
  lottoClassId: number;
  lottoClassCode: string;
  lottoCategoryCode: string;
  className: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  commissionPercent: number;
  ruleDes: string;
  typeInstallment: string;
  createStatus: string;
  viewStatus: string;
  groupList: string;
  affiliateList: string;
  timeAfterBuy: number;
  timeBeforeLotto: number;
}
interface PrizeList {
  sumPrizeId: number;
  sumPrizeCode: string;
  lottoClassCode: string;
  msdLottoKindCode: string;
  sumPrizeCost: number;
  justSumPrize: number;
  sumPlusSwapped: number;
  installment?: any;
  lottoNumber: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: any;
  updatedAt?: any;
  sumPayCost: number;
}

interface LottoList {
  kindCode: string;
  kindName: string;
  sumBet?: number;
  prizeList: PrizeList[];
}

interface installment {
  lottoResultInstallment: String,
}

interface lottoDashboard {
  lottoClassCode: string;
  className: string;
  sumBet: number;
  lottoList: LottoList[];
}

@Component({
  selector: 'app-lotto-approved',
  templateUrl: './lotto-approved.component.html',
  styleUrls: ['./lotto-approved.component.scss']
})
export class LottoApprovedComponent implements OnInit {

  lottoClassList: lottoClass[] = [];
  installmentList: any;
  data: any = null;
  lottoResult: any = [];
  lottoResult2: any = null;
  constructor(
    private router: Router,
    private beanSer: BeanService,
  ) {
  }
  header = [
    { header: 'Lotto Name', field: 'lottoName', type: 'text' },
    { header: 'Lotto Number', field: 'lottoNumber', type: 'textNumber' },
  ];

  tr = [
    'lottoName',
    'lottoNumber',
  ];

  categoryCode = 0;
  installment = 0;
  categoryList = [
    { display: 'Government', value: 'GOVERNMENT' },
    { display: 'Stock', value: 'STOCKS' },

  ];
  // classList = [
  //   { display: 'Government', value: 'GOVERNMENT' },
  //   { display: 'Stock', value: 'STOCK' },
  //   { display: 'Yeekee', value: 'Yeekee' }
  // ];

  displayedColumns: any = [
    'lottoInstallment',
    'createdBy',
    'createdAt',
    'status',

  ];

  lottoResultList = {
    digit3Top: "",
    digit3Swap: "",
    digit3Front: "",
    digit3Bot: "",
    digit2Top: "",
    digit2Bot: "",
    digit1Top: "",
    digit1Bot: "",
  }
  lottoResultList2 = {
    lottoName: "TEST",
    lottoNumber: "600",
  }


  lottoResultArray = [];

  classCode = 0;

  sumPrize = 0;
  lottoClassCode;

  stompClient;
  ngOnInit(): void {
    this.getClassCode(this.categoryList[this.categoryCode].value);
    // this.getLottoResult()
  }

  getClassCode(categoryList) {
    console.log(categoryList)
    this.lottoClassList = [];
    this.data = null;
    this.beanSer.doGet(`${URL.GET_CLASS_CODE_BY}/${categoryList}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.lottoClassList = data.data;

        if (this.lottoClassList.length != 0) {
          this.categoryCode = 0;
          this.lottoClassCode = this.lottoClassList[this.classCode].lottoClassCode
          this.getDashboard(this.categoryCode, this.lottoClassList[this.classCode].lottoClassCode);
        }
      }
    });
  }

  getDashboard(number, classCode) {
    this.getInstallment(number, classCode)
    console.log(classCode)
    console.log(number)
    this.classCode = number;
    this.data = null;
    this.beanSer.doGet(`${URL.GET_DASHBOARD}/${classCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.data = data
        console.log('getDashboard -> data', data);
      }
    });
  }

  // getLottoResult(event)
  // {
  //   this.beanSer.doGet(`${URL.GET_LOTTO_RESULT}?lottoClassCode=${event}`).subscribe(data => {
  //     if (data.status == 'SUCCESS') {
  //       // this.data=data

  //       console.log('getLottoResult-> data', data);
  //       console.log(this.lottoResult);
  //     }
  //   });
  // }

  getLottoResult(event) {
    console.log(event);
    this.router.navigate(['lotto-settings/lotto-approved-detail'],
      { queryParams: { classCode: event.lottoClassCode, installment: event.lottoResultInstallment, codeGroup: event.codeGroup } });
  }

  getDateStr(date) {
    if (!date) return '';

    const listIn = date.split('-');
    const intBad = `${listIn[2]}-${listIn[1]}-${listIn[0]}`
    return intBad;
  }

  getInstallment(event, classCode) {
    this.beanSer.doGet(`${URL.GET_LOTTO_RESULT_INSTALLMENT}?lottoClassCode=${classCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.installmentList = data.data
        console.log('getInstallment Result -> data', data);
      }
    });
  }
}
