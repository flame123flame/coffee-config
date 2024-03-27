import { BeanService } from './../../../service/BeanService.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { SocketBeansService } from 'src/app/service/socket-beans.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  GET_DASHBOARD: 'dashboard/get-dashboard',
  GET_CLASS_CODE_BY: 'lotto-class/get-lotto-class',
  GET_SUM_DASBOARD: 'dashboard/get-dashboard-sum-prize'
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

interface lottoDashboard {
  lottoClassCode: string;
  className: string;
  sumBet: number;
  lottoList: LottoList[];
}


@Component({
  selector: 'app-lotto-dashboard',
  templateUrl: './lotto-dashboard.component.html',
  styleUrls: ['./lotto-dashboard.component.scss']
})
export class LottoDashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() onSortChange = new EventEmitter<any>();
  lottoCategoryList: lottoClass[] = [];
  data: any = null;

  constructor(
    private beanSer: BeanService,
    // private socket: SocketService,
  ) {
  }
  header = [
    { header: 'Number', field: 'lottoNumber', type: 'textNumber' },
    { header: 'Total Prize (฿)', field: 'sumPrizeCost', type: 'pipeNumber' },
    { header: 'Sum Bet (฿)', field: 'sumPayCost', type: 'pipeNumber' },
    { header: 'Level ', field: 'tierLevel', type: 'text' },
  ];

  header2 = [
    { header: 'ประเภท', field: 'msdLottoKindName', type: 'text' },
    { header: 'ยอดแทง', field: 'sumPayCost', type: 'pipeNumber' },
    { header: 'ยอดรางวัล', field: 'sumPrizeCost', type: 'pipeNumber' },
    { header: 'ผลกำไร', field: 'sumProfit', type: 'pipeNumber' },
  ];

  sumProfit: any = null;
  sumPayCost: any = null;
  sumPrizeCost: any = null;
  sumDashboard: any = null;

  tr = [
    'no',
    'lottoNumber',
    'sumPrizeCost',
    'sumPayCost',
    'tierLevel'
  ];

  displayedColumns: any = [
    'msdLottoKindName',
    'sumPayCost',
    'sumPrizeCost',
    'sumProfit',
  ];

  classCode = 0;
  classList = [
    { display: 'Government', value: 'GOVERNMENT' },
    { display: 'Stock', value: 'STOCKS' },
  ];

  KindNameList = [
    { kindName: '3 ตัวบน' },
    { kindName: '3 ตัวโต๊ด' },
    { kindName: '2 ตัวบน' },
    { kindName: '2 ตัวล่าง' },
    { kindName: 'วิ่งบน' },
    { kindName: 'วิ่งล่าง' },
    { kindName: '3 ตัวหน้า' },
    { kindName: '3 ตัวล่าง' },
  ];

  digit3Top = [];
  digit3Swap = [];
  digit3Mix = [];
  digit2Top = [];
  digit2Bot = [];
  digit1Top = [];
  digit1Bot = [];
  digit3front = [];
  digit3bot = [];
  digiMixed = [];


  categoryCode = 0;

  sumPrize = 0;

  stompClient;
  connected = false;
  connectStatus = '';
  connectCode = 0;

  loading = false;

  private socketBeansService = new SocketBeansService();

  ngOnInit(): void {

    this.socketBeansService.dashBoardList.subscribe((data) => {
      if (data && data.lottoClassCode == this.lottoCategoryList[this.categoryCode].lottoClassCode) {
        this.data = data;
        this.sumPrize = 0;
        (this?.data?.lottoListLv ?? []).forEach(kind => {
          this.sumPrize += (kind?.prizeList ? kind?.prizeList[0] : [])?.sumPrizeCost ?? 0;
        });
      }
      if (this.data) {
        this.digit3Top = [];
        this.digit3Swap = [];
        this.digit2Top = [];
        this.digit2Bot = [];
        this.digit1Top = [];
        this.digit1Bot = [];
        this.digit3front = [];
        this.digit3bot = [];

        this.data.lottoListLv.forEach(element => {
          if (element.kindCode == '3DIGIT_TOP') {
            this.digit3Top = element;
          }
          if (element.kindCode == '3DIGIT_SWAPPED') {
            this.digit3Swap = element;
          }
          if (element.kindCode == '2DIGIT_TOP') {
            this.digit2Top = element;
          }
          if (element.kindCode == '2DIGIT_BOT') {
            this.digit2Bot = element;
          }
          if (element.kindCode == '1DIGIT_TOP') {
            this.digit1Top = element;
          }
          if (element.kindCode == '1DIGIT_BOT') {
            this.digit1Bot = element;
          }
          if (element.kindCode == '3DIGIT_FRONT') {
            this.digit3front = element;
          }
          if (element.kindCode == '3DIGIT_BOT') {
            this.digit3bot = element;
          }
          if (element.kindCode == 'DIGI3_MIX') {
            this.digiMixed = element;
          }
        });
      }
    });

    this.socketBeansService.state().subscribe((message) => {
      this.connectCode = message;
      this.connectStatus = MessageService.GET_STATUS_SOCKET(message);
    });

    this.socketBeansService.streamDashboardSum().subscribe((message) => {
      let data = JSON.parse(message.body);
      if (data && data.classCode == this.lottoCategoryList[this.categoryCode].lottoClassCode) {
        this.sumDashboard = data.list;
        data.list.forEach(element => {
          this.sumProfit += element.sumProfit;
          this.sumPayCost += element.sumPayCost;
          this.sumPrizeCost += element.sumPrizeCost;
        });
      }
    });

    // this.socket.initConnect();
    // this.socket.statusConnect.subscribe(status => {
    //   // this.connected = status;
    // });
    // this.socket.postList.subscribe(data => {
    // });

    // this.socket.dashSum.subscribe(data => {
    // });

    this.getClassCode(this.classList[this.classCode].value);
  }

  ngOnDestroy() {
    // this.socket.disconnect();
    this.socketBeansService.disconnect();
  }

  getClassCode(classCode) {
    // ดึง kind 2 3 ตัว
    this.lottoCategoryList = [];
    this.data = null;
    this.beanSer.doGet(`${URL.GET_CLASS_CODE_BY}/${classCode}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.lottoCategoryList = data.data;
        if (this.lottoCategoryList.length != 0) {
          this.categoryCode = 0;
          this.getDashboard(this.categoryCode, this.lottoCategoryList[this.categoryCode].lottoClassCode);
        }
      }
    });
  }

  getSumDashBoard(classCode) {
    this.beanSer.doGet(`${URL.GET_SUM_DASBOARD}/${classCode}`).subscribe(data => {
      this.sumProfit = 0;
      this.sumPayCost = 0;
      this.sumPrizeCost = 0;
      if (data.status == 'SUCCESS') {
        this.sumDashboard = data.data.list;
        data.data.list.forEach(element => {
          this.sumProfit += element.sumProfit;
          this.sumPayCost += element.sumPayCost;
          this.sumPrizeCost += element.sumPrizeCost;
        });
      }
    });
  }


  getDashboard(number, categoryCode) {
    if (this.loading) return;
    this.loading = true;
    this.getSumDashBoard(categoryCode);
    this.categoryCode = number;
    this.data = null;
    this.beanSer.doGet(`${URL.GET_DASHBOARD}/${categoryCode}`).subscribe(data => {
      this.loading = false;
      if (data.status == 'SUCCESS') {
        this.socketBeansService.dashBoardList.next(data.data);
      }
    });
  }

  _sortChange(event) {
    this.onSortChange.emit(event);
  }

}
