import { MessageService } from './../../../../service/message.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { LottoConstants } from '../../lotto-constants/lotto-constants';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RequestPaginateRespond } from 'src/app/models/RequestRespond';
import { paginateData } from 'src/app/pages/player_management/failed-login/failed-login.component';
import * as moment from 'moment';

const URL = {
  GROUP_RISK_GET: 'lotto-report/get-lotto-report-transaction-by-installment',
  GET_WIN: 'lotto-report/get-lotto-sum-win',
  GET_ALL_TRANSACTION_BY_KINDCODE: 'lotto-report/get-All-lotto-report-transaction-by-kindcode',

  // ================== YEEKEE REPORT ==================
  PAGINATE_GROUP_RISK_GET_YEEKEE: 'lotto-report/paginate-sum-lotto-transaction-yeekee',
  GET_SUM_PRIZE_CORRECT: 'lotto-report/get-total-sum-prize-correct',
  GET_WIN_YEEKEE: 'lotto-report/get-lotto-sum-win-yeekee',

  PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE: 'lotto-report/paginate-lotto-report-yeekee-transaction-by-kindcode',
  PAGINATE_LOTTO_YEEKEE_UPDATE: 'lotto-report/paginate-updated-lotto-result-yeekee-sum-number'
  // GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE: 'lotto-report/get-All-lotto-report-yeekee-transaction-by-kindcode',

  // ================== YEEKEE REPORT ==================
};

class displayedColumns {
  username: any
  lottoGroupTransactionCode: any
  msdLottoKindName: any
  countSeq: any
  payCost: any
  prizeCost: any
  prizeCorrect: any
}

@Component({
  selector: 'app-lotto-report-detail',
  templateUrl: './lotto-report-detail.component.html',
  styleUrls: ['./lotto-report-detail.component.scss']
})
export class LottoReportDetailComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('paginator4') paginator4: MatPaginator;
  @ViewChild('paginator5') paginator5: MatPaginator;
  @ViewChild('paginator6') paginator6: MatPaginator;
  @ViewChild('paginator7') paginator7: MatPaginator;
  @ViewChild('paginator8') paginator8: MatPaginator;
  dataSource: MatTableDataSource<displayedColumns>;
  data3DigiTop: MatTableDataSource<displayedColumns>;
  data3DigiSwap: MatTableDataSource<displayedColumns>;
  data3DigiFront: MatTableDataSource<displayedColumns>;
  data3DigiBot: MatTableDataSource<displayedColumns>;
  data2DigiBot: MatTableDataSource<displayedColumns>;
  data2DigiTop: MatTableDataSource<displayedColumns>;
  data1DigiBot: MatTableDataSource<displayedColumns>;
  data1DigiTop: MatTableDataSource<displayedColumns>;

  roundYeekeeName = '';
  categoryCode = '';
  roundYeekee = 0;
  dataLength3DigiTop: number;
  dataLength3DigiBot: number;
  dataLength3DigiFront: number;
  dataLength3DigiSwap: number;
  dataLength2DigiTop: number;
  dataLength2DigiBot: number;
  dataLength1DigiTop: number;
  dataLength1DigiBot: number;
  dataLengthUpdated: number;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private beanSer: BeanService,
    private httpBeanService: BeanService,
  ) { }

  SumPrizeCorrect: any = null
  SumPrizeCorrect1: any = null
  SumPrizeCorrect2: any = null
  SumPrizeCorrect3: any = null
  SumPrizeCorrect4: any = null
  SumPrizeCorrect5: any = null
  SumPrizeCorrect6: any = null
  SumPrizeCorrect7: any = null
  SumPrizeCorrect8: any = null


  sumSumMsdWin: any = null
  sumSumPrizeCorrectWin: any = null
  sumSumPayCorrectWin: any = null
  sumProfit: any = null
  installment
  transactionReport = [];
  Summary: [];
  code = {};

  digi3TopReport: any = null
  digi3BotReport: any = null
  digi3SwapReport: any = null
  digi3FrontReport: any = null
  digi2TopReport: any = null
  digi2BotReport: any = null
  digi1BotReport: any = null
  digi1TopReport: any = null
  solveResultList = [];
  displayedColumns: any = [
    'username',
    'lottoGroupTransactionCode',
    'msdLottoKindName',
    'countSeq',
    'payCost',
    'prizeCost',
    'prizeCorrect',

  ];

  displayedColumns2: any = [
    'msdLottoKindName',
    'sumMsdWin',
    'sumPayCorrectWin',
    'sumPrizeCorrectWin',
    'sumTest'
  ];

  columnsUpdated: any = [
    {
      header: 'ผลรวมตัวเลข',
      field: 'sumNumber',
    },
    {
      header: 'ตัวเลขอันดับที่ 16',
      field: 'numberSeq16',
    },
    {
      header: 'ผล',
      field: 'numberResult',
    },

    {
      header: 'วันที่แก้ไข',
      field: 'updatedAt',
      type: 'textCenter',
    },
    {
      header: 'แก้ไขโดย',
      field: 'updatedBy',
    },
  ]

  trUpdated: any = [
    'sumNumber',
    'numberSeq16',
    'numberResult',
    'updatedAt',
    'updatedBy',
    'changeResult'
  ];

  dataLengthTotalReportYeekee = 0;
  dataInputX = [];
  ngOnInit(): void {
    const code = this.activateRoute.snapshot.queryParams;
    this.code = code;
    this.roundYeekeeName = "รอบที่ " + code['roundYeekee'];
    this.roundYeekee = code['roundYeekee'];
    this.categoryCode = code.categoryCode;
    this.installment = code.installment
    this.getSumPrizeCorrect(code)
    this.getSolveResultYeekee(code);
    // console.log(this.installment);
    this.gettransactionReport(code)
    this.getSumWin(code)

    this.getSumReportBy3DigiTop(code)
    this.getSumReportBy3DigiSwap(code)
    this.getSumReportBy3DigiFront(code)
    this.getSumReportBy3DigiBot(code)
    this.getSumReportBy2DigiBot(code)
    this.getSumReportBy2DigiTop(code)
    this.getSumReportBy1DigiBot(code)
    this.getSumReportBy1DigiTop(code)

    // console.log(this.getSumWin)
    this.dataSource = new MatTableDataSource();
    this.data3DigiTop = new MatTableDataSource();
    this.data3DigiSwap = new MatTableDataSource();
    this.data3DigiFront = new MatTableDataSource();
    this.data3DigiBot = new MatTableDataSource();
    this.data2DigiBot = new MatTableDataSource();
    this.data2DigiTop = new MatTableDataSource();
    this.data1DigiBot = new MatTableDataSource();
    this.data1DigiTop = new MatTableDataSource();

    // console.log(this.dataSource)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.data3DigiTop.paginator = this.paginator1;
    this.data3DigiSwap.paginator = this.paginator3;
    this.data3DigiFront.paginator = this.paginator2;
    this.data3DigiBot.paginator = this.paginator4;
    this.data2DigiBot.paginator = this.paginator6;
    this.data2DigiTop.paginator = this.paginator5;
    this.data1DigiBot.paginator = this.paginator8;
    this.data1DigiTop.paginator = this.paginator7;
  }

  getSolveResultYeekee(code){

    this.paginateReq2.filter = [
      { column: 'tb.status', op: '=', value: 'SUCCESS', value1: '' },
      { column: 'tb.class_code', op: '=', value: code.classCode, value1: '' },
      { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
      { column: 'tb.round_number', op: '=', value: code.roundYeekee, value1: '' }
    ];
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.httpBeanService.doPost(`${URL.PAGINATE_LOTTO_YEEKEE_UPDATE}`, this.paginateReq2).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   PAGINATE_LOTTO_YEEKEE_SOLVE  ",res )
        if (res.status === 'SUCCESS') {
          this.solveResultList = res.data.data;
          this.solveResultList.forEach(item => {
            item.updatedAt = moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss");
          })
          this.dataLengthUpdated = res.data.recordsTotal;
        }
      });
    }
  }

  getSumPrizeCorrect(code) {
    this.httpBeanService.doGet(`${URL.GET_SUM_PRIZE_CORRECT}?classCode=${code.classCode}&installment=${code.installment}&roundYeekee=${code.roundYeekee}`).subscribe(res => {
      console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ YEEKEE SUM PRIZE  ", res)
      if (res.status == MessageService.MSG.SUCCESS) {
        this.SumPrizeCorrect = res.data;
      }
    });
  }

  gettransactionReport(code) {
    console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ OUT", code.categoryCode)
    let sumdata = []
    this.installment = this.installment



    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GROUP_RISK_GET_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ YEEKEE XXX  ", res)
        if (res.status == MessageService.MSG.SUCCESS) {
          this.transactionReport = res.data.data;
          this.dataSource.data = this.transactionReport;
          this.dataLengthTotalReportYeekee = res.data.recordsTotal;
          console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   YEEKEE  ", this.transactionReport)
          // res.data.data.forEach(element => {
          //   sumdata.push(element['SumPrizeCorrect'])
          //   this.SumPrizeCorrect = this.SumPrizeCorrect + element['prizeCorrect']
          // });
        }
      })
    }
    else {
      this.httpBeanService.doGet(`${URL.GROUP_RISK_GET}?classCode=${code.classCode}&installment=${code.installment}`).subscribe(res => {
        this.transactionReport = res.data;
        this.dataSource.data = res.data
        console.log(this.dataSource)
        this.SumPrizeCorrect = 0
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   OTHER  ", this.transactionReport)
        if (res.status === 'SUCCESS') {
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect)
            this.SumPrizeCorrect = this.SumPrizeCorrect + element.prizeCorrect
          });
          // console.log(this.SumPrizeCorrect)

        }

      });
    }


  }

  getSumReportBy3DigiTop(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_3DIGIT_TOP, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_3DIGIT_TOP  ",res )
        if (res.status === 'SUCCESS') {
          this.digi3TopReport = res.data.data;
          this.data3DigiTop.data = this.digi3TopReport;
          this.dataLength3DigiTop = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect1'])
            this.SumPrizeCorrect1 = this.SumPrizeCorrect1 + element['prizeCorrect']
          });
        }
      });


    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_3DIGIT_TOP}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect1 = 0

        if (res.status === 'SUCCESS') {
          this.digi3TopReport = res.data
          this.data3DigiTop.data = res.data
          // console.log(this.data3DigiTop)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect1)
            this.SumPrizeCorrect1 = this.SumPrizeCorrect1 + element.prizeCorrect
            // console.log(this.SumPrizeCorrect1)
          });


        }

      });
    }

  }

  getSumReportBy3DigiBot(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_3DIGIT_BOT, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_3DIGIT_BOT  ",res )
        if (res.status === 'SUCCESS') {
          this.digi3BotReport = res.data.data;
          this.data3DigiBot.data = this.digi3BotReport;
          this.dataLength3DigiBot = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect2'])
            this.SumPrizeCorrect2 = this.SumPrizeCorrect2 + element['prizeCorrect']
            // console.log(this.SumPrizeCorrect1)
          });
        }
      });

    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_3DIGIT_BOT}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect2 = 0
        if (res.status === 'SUCCESS') {
          this.digi3BotReport = res.data
          this.data3DigiBot.data = res.data
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect2)
            this.SumPrizeCorrect2 = this.SumPrizeCorrect2 + element.prizeCorrect
          });

        }

      });
    }

  }

  getSumReportBy3DigiFront(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_3DIGIT_FRONT, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_3DIGIT_FRONT  ",res.data.data )
        if (res.status === 'SUCCESS') {
          this.digi3FrontReport = res.data.data;
          this.data3DigiFront.data = this.digi3FrontReport;
          this.dataLength3DigiFront = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect3'])
            this.SumPrizeCorrect3 = this.SumPrizeCorrect3 + element['prizeCorrect']
            // console.log(this.SumPrizeCorrect1)
          });
          // console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_3DIGIT_FRONT  ",this.SumPrizeCorrect3 )
        }
      });

    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_3DIGIT_FRONT}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect3 = 0
        if (res.status === 'SUCCESS') {
          this.digi3FrontReport = res.data
          this.data3DigiFront.data = res.data
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect3)
            this.SumPrizeCorrect3 = this.SumPrizeCorrect3 + element.prizeCorrect
          });

        }

      });
    }

  }
  getSumReportBy3DigiSwap(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_3DIGIT_SWAPPED  ",res )
        if (res.status === 'SUCCESS') {
          this.digi3SwapReport = res.data.data;
          this.data3DigiSwap.data = this.digi3SwapReport;
          this.dataLength3DigiSwap = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect4'])
            this.SumPrizeCorrect4 = this.SumPrizeCorrect4 + element['prizeCorrect']
            // console.log(this.SumPrizeCorrect1)
          });
        }
      });

    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect4 = 0
        if (res.status === 'SUCCESS') {
          this.digi3SwapReport = res.data
          this.data3DigiSwap.data = res.data
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect4)
            this.SumPrizeCorrect4 = this.SumPrizeCorrect4 + element.prizeCorrect
          });

        }

      });
    }

  }
  getSumReportBy2DigiTop(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_2DIGIT_TOP, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_2DIGIT_TOP  ",res )
        if (res.status === 'SUCCESS') {
          this.digi2TopReport = res.data.data;
          this.data2DigiTop.data = this.digi2TopReport;
          this.dataLength2DigiTop = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect5'])
            this.SumPrizeCorrect5 = this.SumPrizeCorrect5 + element['prizeCorrect']
            // console.log(this.SumPrizeCorrect1)
          });
        }
      });


    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_2DIGIT_TOP}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect5 = 0
        if (res.status === 'SUCCESS') {
          this.data2DigiTop.data = res.data
          this.digi2TopReport = res.data
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect5)
            this.SumPrizeCorrect5 = this.SumPrizeCorrect5 + element.prizeCorrect
          });

        }

      });
    }

  }

  getSumReportBy2DigiBot(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_2DIGIT_BOT, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_2DIGIT_BOT  ",res )
        if (res.status === 'SUCCESS') {
          this.digi2BotReport = res.data.data;
          this.data2DigiBot.data = this.digi2BotReport;
          this.dataLength2DigiBot = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect6'])
            this.SumPrizeCorrect6 = this.SumPrizeCorrect6 + element['prizeCorrect']
            // console.log(this.SumPrizeCorrect1)
          });
        }
      });


    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_2DIGIT_BOT}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect6 = 0
        if (res.status === 'SUCCESS') {
          this.digi2BotReport = res.data
          this.data2DigiBot.data = res.data
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect6)
            this.SumPrizeCorrect6 = this.SumPrizeCorrect6 + element.prizeCorrect
          });

        }

      });
    }

  }
  getSumReportBy1DigiTop(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_1DIGIT_TOP, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_1DIGIT_TOP  ",res )
        if (res.status === 'SUCCESS') {
          this.digi1TopReport = res.data.data;
          this.data1DigiTop.data = this.digi1TopReport;
          this.dataLength1DigiTop = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect7'])
            this.SumPrizeCorrect7 = this.SumPrizeCorrect7 + element['prizeCorrect']
            // console.log(this.SumPrizeCorrect1)
          });
        }
      });


    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_1DIGIT_TOP}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect7 = 0
        if (res.status === 'SUCCESS') {
          this.digi1TopReport = res.data
          this.data1DigiTop.data = res.data
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect7)
            this.SumPrizeCorrect7 = this.SumPrizeCorrect7 + element.prizeCorrect
          });

        }

      });
    }

  }
  getSumReportBy1DigiBot(code) {
    let sumdata = []
    if (code.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.paginateReq.filter = [
        { column: 'tb.status', op: '=', value: 'WIN', value1: '' },
        { column: 'tb.lotto_class_code', op: '=', value: code.classCode, value1: '' },
        { column: 'tb.lotto_kind_code', op: '=', value: LottoConstants.MSD_LOTTO_1DIGIT_BOT, value1: '' },
        { column: 'tb.installment', op: '=', value: code.installment, value1: '' },
        { column: 'tb.round_yeekee', op: '=', value: code.roundYeekee, value1: '' }
      ];
      this.httpBeanService.doPost(`${URL.PAGINATE_GET_ALL_TRANSACTION_BY_KINDCODE_YEEKEE}`, this.paginateReq).subscribe((res: RequestPaginateRespond<paginateData>) => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   MSD_LOTTO_1DIGIT_BOT  ",res )
        if (res.status === 'SUCCESS') {
          this.digi1BotReport = res.data.data;
          this.data1DigiBot.data = this.digi1BotReport;
          this.dataLength1DigiBot = res.data.recordsTotal;
          res.data.data.forEach(element => {
            sumdata.push(element['SumPrizeCorrect8'])
            this.SumPrizeCorrect8 = this.SumPrizeCorrect8 + element['prizeCorrect']
            // console.log(this.SumPrizeCorrect1)
          });
        }
      });


    }
    else {
      this.httpBeanService.doGet(`${URL.GET_ALL_TRANSACTION_BY_KINDCODE}?classCode=${code.classCode}&kindCode=${LottoConstants.MSD_LOTTO_1DIGIT_BOT}&installment=${code.installment}`).subscribe(res => {
        this.SumPrizeCorrect8 = 0
        if (res.status === 'SUCCESS') {
          this.digi1BotReport = res.data
          this.data1DigiBot.data = res.data
          // console.log(res)

          res.data.forEach(element => {
            sumdata.push(element.SumPrizeCorrect8)
            this.SumPrizeCorrect8 = this.SumPrizeCorrect8 + element.prizeCorrect
          });

        }

      });
    }

  }


  getSumWin(event) {
    if (this.categoryCode == LottoConstants.LOTTO_YEEKEE) {

      this.httpBeanService.doGet(`${URL.GET_WIN_YEEKEE}?classCode=${event.classCode}&installment=${event.installment}&roundYeekee=${this.roundYeekee}`).subscribe(res => {
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ YEEKEE getSumWin  ", res)
        this.Summary = res.data;
        let sumdata1 = []

        this.sumSumMsdWin = 0;
        this.sumSumPrizeCorrectWin = 0;
        this.sumSumPayCorrectWin = 0;
        this.sumProfit = 0;

        if (res.status === 'SUCCESS') {
          // console.log(res)

          res.data.forEach(element => {
            sumdata1.push(element.sumSumMsdWin)
            this.sumSumMsdWin = this.sumSumMsdWin + element.sumMsdWin
            this.sumSumPrizeCorrectWin = this.sumSumPrizeCorrectWin + element.sumPrizeCorrectWin
            this.sumSumPayCorrectWin = this.sumSumPayCorrectWin + element.sumPayCorrectWin
            this.sumProfit = this.sumProfit + element.sumProfit
          });
          // console.log(this.SumPrizeCorrect)
          // console.log(this.SumPrizeCorrect)
          this.length = res.data.recordsTotal
        }
      });
    }
    else {
      this.httpBeanService.doGet(`${URL.GET_WIN}?classCode=${event.classCode}&installment=${event.installment}`).subscribe(res => {
        this.Summary = res.data;
        let sumdata1 = []

        this.sumSumMsdWin = 0;
        this.sumSumPrizeCorrectWin = 0;
        this.sumSumPayCorrectWin = 0;
        this.sumProfit = 0;

        if (res.status === 'SUCCESS') {
          // console.log(res)

          res.data.forEach(element => {
            sumdata1.push(element.sumSumMsdWin)
            this.sumSumMsdWin = this.sumSumMsdWin + element.sumMsdWin
            this.sumSumPrizeCorrectWin = this.sumSumPrizeCorrectWin + element.sumPrizeCorrectWin
            this.sumSumPayCorrectWin = this.sumSumPayCorrectWin + element.sumPayCorrectWin
            this.sumProfit = this.sumProfit + element.sumProfit
          });
          // console.log(this.SumPrizeCorrect)
          // console.log(this.SumPrizeCorrect)
          this.length = res.data.recordsTotal
        }
      });
    }

  }
  length: number = 0;
  length1: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest();
  paginateReq2: PaginateRequest = new PaginateRequest();
  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex
    this.paginateReq.length = event.pageSize
    this.gettransactionReport
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.paginateReq.sort.push(sort)
    }
    this.gettransactionReport
  }

  goBack() {
    if (this.categoryCode == LottoConstants.LOTTO_YEEKEE) {
      this.router.navigate(["lotto-settings/lotto-report-round"],
        { queryParams: { categoryCode: this.code['lottoCategoryCode'], classCode: this.code['classCode'], installment: this.code['installment'], className: this.code['className'] } }
      );

    }
    else {
      this.router.navigate(["lotto-settings/lotto-report"]);
    }
  }

}
