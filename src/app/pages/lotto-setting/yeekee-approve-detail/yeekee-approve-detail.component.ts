import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BeanService } from 'src/app/service/BeanService.service';
import { MessageService } from 'src/app/service/message.service';
import { MatSort } from '@angular/material/sort';

const URL = {
  GET_LOTTO_CLASS_BY_CLASS_CODE: 'lotto-class/get-lotto-class-by-class-code/',
  GET_YEEKEE_RESULT: 'yeekee-result/get-yeekee-result-by-lotto-category-code',
  GET_YEEKEE_NUMBER16: 'yeekee-result/get-yeekee-number-16',
  SUBMIT_MANUAL_NUMBER: 'yeekee-result/submit-result-manual',
  GET_BY_CODE: 'yeekee-result/get-yeekee-sum-number-by-code',
}

export interface LottoClass {
  lottoClassId: number,
  lottoClassCode: string,
  lottoCategoryCode: string,
  className: string,
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string,
  ruleDes: string,
  typeInstallment: string,
  createStatus: string,
  viewStatus: string,
  timeAfterBuy: string,
  timeBeforeLotto: number,
  lottoClassImg: string,
  closeMessage: string,
  prefixTransNumber: string,
  countRefund: number,
  autoUpdateWallet: boolean,
  ignoreWeekly: boolean,
  countTime: string,
  roundTime: string,
  stopTime: string,
  startTime: string,
  hasBet: number,
  earningsPercent: number;
}
@Component({
  selector: 'app-yeekee-approve-detail',
  templateUrl: './yeekee-approve-detail.component.html',
  styleUrls: ['./yeekee-approve-detail.component.scss']
})
export class YeekeeApproveDetailComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator') paginator2: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // TOP
  columnTop: any = [
    {
      header: 'เลขที่ซื้อ',
      field: 'lottoNumber'
    },
    {
      header: 'ราคาที่จ่าย',
      field: 'sumPrize'
    },
    {
      header: 'กำไร',
      field: 'earning'
    },
    {
      header: 'เปอร์เซ็นสูญเสีย',
      field: 'percentLoss'
    },
    {
      header: 'จำนวนคนที่ถูก',
      field: 'countUser'
    },

  ];
  trTop: any = [
    'lottoNumber',
    'sumPrize',
    'earning',
    'percentLoss',
    'countUser'
  ];
  dataInputTop: MatTableDataSource<[]>;
  dataInputBot: MatTableDataSource<[]>;
  // BOT
  columnBot: any = [
    {
      header: 'เลขที่ซื้อ',
      field: 'lottoNumber'
    },
    {
      header: 'ราคาที่จ่าย',
      field: 'sumPrize'
    },
    {
      header: 'กำไร',
      field: 'earning'
    },
    {
      header: 'เปอร์เซ็นสูญเสีย',
      field: 'percentLoss'
    },
    {
      header: 'จำนวนคนที่ถูก',
      field: 'countUser'
    },

  ];
  trBot: any = [
    'lottoNumber',
    'sumPrize',
    'earning',
    'percentLoss',
    'countUser'
  ];

  dataTest = [
    {
      lottoNumber: "615",
      sumPrize: "48500",
      earning: "123",
      percentLoss: "1168.32",
      countUser: "26",
    }
  ]

  dataTest2 = []

  digit3top = []
  digit3swap = []
  digit2top = []
  digit2bot = []
  digit1top = []
  digit1bot = []

  sumBot = 0
  sumTop = 0

  sumPrizeDigit1 = 0;
  dataTopNumber = []
  dataBotNumber: any

  yeekeeSumNumberCode:any;
  className: any;
  classCode: any;
  sumNumber: any;
  roundNumber: any;
  roundYeekee: any;
  installment: any;
  lottoNo16: any;
  lottoResult: any;

  lottoClass: LottoClass;
  earningsPercent = 0;
  lottoBot: String;
  lottoTop: String;
  showSumNumber:any;
  showNumberNo16:any;
  formChangeNumber: FormGroup
  disable1: boolean = false
  disable2: boolean = false
  numberCheckTop = []
  numberCheckBot = []
  constructor(
    private router: Router,
    private httpBeanService: BeanService,
    private routeParam: ActivatedRoute,
    private forbuilder: FormBuilder
  ) {
    this.routeParam.queryParams.subscribe(res => {
      if (res) {
        this.className = res.className;
        this.classCode = res.classCode;
        this.roundNumber = res.roundNumber;
        this.installment = res.installment;
        this.yeekeeSumNumberCode = res.yeekeeSumNumberCode;
        this.getYeekeeResult()
      }
    });
    this.dataInputTop = new MatTableDataSource();
    this.dataInputBot = new MatTableDataSource();
  }

  percentResult = 0
  ngOnInit(): void {
   
    this.getYeekeeResult()
    this.createForm();
  }

  ngAfterViewInit() {
    this.dataInputTop.paginator = this.paginator2;
    this.dataInputBot.paginator = this.paginator1;
    this.dataInputBot.sort = this.sort;
    this.dataInputTop.sort = this.sort;
    
  }

  async getLottoClassByClassCode() {
    const data: any = await this.httpBeanService.doGet(URL.GET_LOTTO_CLASS_BY_CLASS_CODE + this.classCode).toPromise();
    if (data.status === 'SUCCESS') {
      this.earningsPercent = data.data.earningsPercent;
    }
  }

  async getYeekeeResult() {
    await Promise.all([
      this.getYeekeeDetail(),
      this.get3digitTop(),
      this.get3digitSwap(),
      this.get2digitTop(),
      this.get2digitBot(),
      this.get1digitTop(),
      this.get1digitBot(),
      this.getLottoClassByClassCode(),
      this.getYeekeeNumber16(),
      
    ]);
    this.percentResult = 100 - this.earningsPercent
    this.lottoResult = this.sumNumber - this.lottoNo16
    this.lottoBot = this.lottoResult.toString().substring(this.lottoResult.toString().length-5,this.lottoResult.toString().length-3).padStart(2, '0');
    this.lottoTop = this.lottoResult.toString().substring(this.lottoResult.toString().length-3,this.lottoResult.toString().length).padStart(3, '0');

    this.sumBetDigitTop();
    this.sumBetDigitBot();
    this.checkDigitTop(this.digit3top, this.digit3swap, this.digit2top, this.digit1top);
    this.checkDigitbot(this.digit2bot, this.digit1bot);
    this.countUserWin();
  }

  async getYeekeeDetail()
  {
    const res = await this.httpBeanService.doGet(`${URL.GET_BY_CODE}/${this.yeekeeSumNumberCode}`).toPromise()
    if (res.status == "SUCCESS") {
      this.sumNumber = res.data.sumNumber
      this.showSumNumber = res.data.sumNumber.toString().padStart(5,'0')
    }
  }

  async get3digitTop() {
    const res = await this.httpBeanService.doGet(`${URL.GET_YEEKEE_RESULT}?lottoClassCode=${this.classCode}&roundYeekee=${this.roundNumber}&installment=${this.installment}&kindCode=${"3DIGIT_TOP"}`).toPromise()
    if (res.status == "SUCCESS") {
      this.digit3top = res?.data ?? []

    }
  }

  async get3digitSwap() {
    const res = await this.httpBeanService.doGet(`${URL.GET_YEEKEE_RESULT}?lottoClassCode=${this.classCode}&roundYeekee=${this.roundNumber}&installment=${this.installment}&kindCode=${"3DIGIT_SWAPPED"}`).toPromise()

    if (res.status == "SUCCESS") {
      this.digit3swap = res?.data ?? []

    }
  }

  async get2digitTop() {
    const res = await this.httpBeanService.doGet(`${URL.GET_YEEKEE_RESULT}?lottoClassCode=${this.classCode}&roundYeekee=${this.roundNumber}&installment=${this.installment}&kindCode=${"2DIGIT_TOP"}`).toPromise()
    if (res.status == "SUCCESS") {
      this.digit2top = res?.data ?? []

    }
  }

  async get2digitBot() {
    const res = await this.httpBeanService.doGet(`${URL.GET_YEEKEE_RESULT}?lottoClassCode=${this.classCode}&roundYeekee=${this.roundNumber}&installment=${this.installment}&kindCode=${"2DIGIT_BOT"}`).toPromise()

    if (res.status == "SUCCESS") {
      this.digit2bot = res?.data ?? []

    }
  }

  async get1digitTop() {
    const res = await this.httpBeanService.doGet(`${URL.GET_YEEKEE_RESULT}?lottoClassCode=${this.classCode}&roundYeekee=${this.roundNumber}&installment=${this.installment}&kindCode=${"1DIGIT_TOP"}`).toPromise()

    if (res.status == "SUCCESS") {
      this.digit1top = res?.data ?? []

    }
  }

  async get1digitBot() {
    const res = await this.httpBeanService.doGet(`${URL.GET_YEEKEE_RESULT}?lottoClassCode=${this.classCode}&roundYeekee=${this.roundNumber}&installment=${this.installment}&kindCode=${"1DIGIT_BOT"}`).toPromise()

    if (res.status == "SUCCESS") {
      this.digit1bot = res?.data ?? []
    }
  }

  async getYeekeeNumber16() {
    const res = await this.httpBeanService.doGet(`${URL.GET_YEEKEE_NUMBER16}?lottoClassCode=${this.classCode}&installment=${this.installment}&roundYeekee=${this.roundNumber}`).toPromise()
    this.lottoNo16 = res?.data ?? []
    this.showNumberNo16 =res.data.toString().padStart(5,'0')
  }



  sumBetDigitTop() {
    this.sumTop = 0;
    this.digit3top.forEach(res => {
      this.sumTop += res.sumBet
    })
    this.digit3swap.forEach(res => {
      this.sumTop += res.sumBet
    })
    this.digit2top.forEach(res => {
      this.sumTop += res.sumBet
    })
    this.digit1top.forEach(res => {
      this.sumTop += res.sumBet
    })
  }

  sumBetDigitBot() {
    this.sumBot = 0;
    this.digit2bot.forEach(res => {
      this.sumBot += res.sumBet
    })
    this.digit1bot.forEach(res => {
      this.sumBot += res.sumBet
    })
  }

  countUserWin() {
    this.dataInputTop.data.forEach(res => {
      res['lottoNumber']
    })
  }

  checkDigitTop(digit3top, digit3swap, digit2top, digit1top) {

    let number = []
    let arrtop = []
    for (let i = 0; i < 1000; i++) {
      if (i < 10) {
        number.push({ lottoNumber: "00" + i, sumPrize: 0, percentLoss: 0, countUser: 0 ,earning: 0})
      }
      else if(i<100 && i>10)
      {
        number.push({ lottoNumber: "0" + i, sumPrize: 0, percentLoss: 0, countUser: 0 ,earning: 0})
      }
      else {
        number.push({ lottoNumber: i.toString(), sumPrize: 0, percentLoss: 0, countUser: 0 ,earning: 0})
      }

    }

    for (let j = 0; j < number.length; j++) {
      digit3top.forEach(element => {

        if (number[j].lottoNumber == element.lottoNumber) {
          number[j].sumPrize += Number(element.sumPrize)
        }
      })
      digit3swap.forEach(element => {
        
        let swapList =[]
        let swapFilter = new Set

        swapList.push(number[j].lottoNumber.charAt(0)+number[j].lottoNumber.charAt(1)+number[j].lottoNumber.charAt(2))
        swapList.push(number[j].lottoNumber.charAt(0)+number[j].lottoNumber.charAt(2)+number[j].lottoNumber.charAt(1))
        swapList.push(number[j].lottoNumber.charAt(1)+number[j].lottoNumber.charAt(0)+number[j].lottoNumber.charAt(2))
        swapList.push(number[j].lottoNumber.charAt(1)+number[j].lottoNumber.charAt(2)+number[j].lottoNumber.charAt(0))
        swapList.push(number[j].lottoNumber.charAt(2)+number[j].lottoNumber.charAt(1)+number[j].lottoNumber.charAt(0))
        swapList.push(number[j].lottoNumber.charAt(2)+number[j].lottoNumber.charAt(0)+number[j].lottoNumber.charAt(1))
        
        swapFilter = new Set(swapList)
        
        swapFilter.forEach(resNumber =>{
          
          if (resNumber == element.lottoNumber) {
            number[j].sumPrize += Number(element.sumPrize)
            
          }
        })
        
      })
      digit2top.forEach(element => {

        if (element.lottoNumber.charAt(0) == number[j].lottoNumber.charAt(1) && element.lottoNumber.charAt(1) == number[j].lottoNumber.charAt(2)) {

          number[j].sumPrize += Number(element.sumPrize)

        }
      })
      digit1top.forEach(element => {
        if (number[j].lottoNumber.includes(element.lottoNumber)) {

          number[j].sumPrize += Number(element.sumPrize)

        }
      })
    }

    if (this.sumTop != 0) {
      for (let index = 0; index < number.length; index++) {
        number[index].percentLoss = ((number[index].sumPrize * 100) / this.sumTop).toFixed(2)
      }
    }
    for (let index = 0; index < number.length; index++) {
      this.digit3top.forEach(element => {
        if (number[index].lottoNumber == element.lottoNumber) {
          number[index].countUser += element.countUser == null ? 0 : element.countUser;
        }
      })
      this.digit3swap.forEach(element => {

        let swapList =[]
        let swapFilter = new Set

        swapList.push(number[index].lottoNumber.charAt(0)+number[index].lottoNumber.charAt(1)+number[index].lottoNumber.charAt(2))
        swapList.push(number[index].lottoNumber.charAt(0)+number[index].lottoNumber.charAt(2)+number[index].lottoNumber.charAt(1))
        swapList.push(number[index].lottoNumber.charAt(1)+number[index].lottoNumber.charAt(0)+number[index].lottoNumber.charAt(2))
        swapList.push(number[index].lottoNumber.charAt(1)+number[index].lottoNumber.charAt(2)+number[index].lottoNumber.charAt(0))
        swapList.push(number[index].lottoNumber.charAt(2)+number[index].lottoNumber.charAt(1)+number[index].lottoNumber.charAt(0))
        swapList.push(number[index].lottoNumber.charAt(2)+number[index].lottoNumber.charAt(0)+number[index].lottoNumber.charAt(1))
        
        swapFilter = new Set(swapList)
        
        swapFilter.forEach(resNumber =>{
          
          if (resNumber == element.lottoNumber) {
            if (number[index].lottoNumber.includes(element.lottoNumber)) {
              number[index].countUser += element.countUser == null ? 0 : element.countUser;
            }
          }
        })
      })
      this.digit2top.forEach(element => {
        if (number[index].lottoNumber.charAt(0) == element.lottoNumber.charAt(1) && number[index].lottoNumber.charAt(0) == element.lottoNumber.charAt(2)) {
          number[index].countUser += element.countUser == null ? 0 : element.countUser;
        }
      })
      this.digit1top.forEach(element => {
        if (number[index].lottoNumber.includes(element.lottoNumber)) {
          number[index].countUser += element.countUser == null ? 0 : element.countUser;
        }
      })
    }
    number.forEach(element => {
      if (element.lottoNumber == this.lottoTop) {
        element.earning = (Number(this.sumTop) - Number(element.sumPrize)).toFixed(2);
        arrtop.push(element)
      }
    })
    
    
    number = number.filter((el: any) => el.percentLoss < 100 - this.earningsPercent);
    for (let index = 0; index < number.length; index++) {
      number[index].earning = (Number(this.sumTop) - Number(number[index].sumPrize)).toFixed(2);
      number[index].lottoNumber = number[index].lottoNumber.padStart(3, '0');
    }
    
    this.dataInputTop.data = number.sort((a, b) =>  b.countUser - a.countUser);

    this.dataTest = arrtop
    this.dataTest.forEach(res => {

      if (Number(res.percentLoss) < this.percentResult) {
        this.formChangeNumber.controls.digitTop.setValue(this.lottoTop);
        this.formChangeNumber.controls.digitTop.disable();
      }
      else
      {
        this.formChangeNumber.controls.digitTop.setValue(this.dataInputTop.data[0]['lottoNumber']);
        this.formChangeNumber.controls.digitTop.disable();
      }
    })
  }


  checkDigitbot(digit2, digit1) {
    let number = []
    let arrbot = []
    for (let i = 0; i < 100; i++) {
      if (i < 10) {
        number.push({ lottoNumber: "0" + i, sumPrize: 0, percentLoss: 0, countUser: 0 ,earning: 0})
      }
      else {
        number.push({ lottoNumber: i.toString(), sumPrize: 0, percentLoss: 0, countUser: 0 ,earning: 0})
      }
    }
    for (let j = 0; j < number.length; j++) {
      digit1.filter(element => {
        if (number[j].lottoNumber.includes(element.lottoNumber)) {
          number[j].sumPrize += Number(element.sumPrize)
        }
      })
      digit2.filter(element => {
        if (element.lottoNumber == number[j].lottoNumber) {
          number[j].sumPrize += Number(element.sumPrize)
        }
      })
    }
    if (this.sumBot != 0) {
      for (let index = 0; index < number.length; index++) {
        number[index].percentLoss = ((number[index].sumPrize * 100) / this.sumBot).toFixed(2);
      }
    }
    for (let index = 0; index < number.length; index++) {
      this.digit2bot.filter(element => {
        if (number[index].lottoNumber == element.lottoNumber) {
          number[index].countUser += element.countUser == null ? 0 : element.countUser;
        }
      })
      this.digit1bot.filter(element => {
        if (number[index].lottoNumber.includes(element.lottoNumber)) {
          number[index].countUser += element.countUser == null ? 0 : element.countUser;
        }
      })
    }
    number.filter(element => {
      if (element.lottoNumber == this.lottoBot) {
        element.earning = (Number(this.sumTop) - Number(element.sumPrize)).toFixed(2);
        arrbot.push(element)
      }
    })                                  
    number = number.filter((el: any) => el.percentLoss < 100 - this.earningsPercent);
    for (let index = 0; index < number.length; index++) {
      number[index].earning = (Number(this.sumBot) - Number(number[index].sumPrize)).toFixed(2);
    }
   
    
    this.dataInputBot.data = number.sort((a, b) => b.countUser - a.countUser)
    
    this.dataTest2 = arrbot
    this.dataTest2.forEach(res => {
      if (Number(res.percentLoss) < this.percentResult) {
        this.formChangeNumber.controls.digitBot.disable();
        this.formChangeNumber.controls.digitBot.setValue(this.lottoBot);
      }
      else
      {
        this.formChangeNumber.controls.digitBot.disable();
        this.formChangeNumber.controls.digitBot.setValue(this.dataInputBot.data[0]['lottoNumber']);
      }
    })

  }

  goBack() {
    this.router.navigate(['lotto-settings/lotto-yeekee-approved'],);
  }

  submitNumber() {
    let hasBotNumber = false
    let hasTopNumber = false
    /** check form */
    const controls = this.formChangeNumber.controls;
    if (this.formChangeNumber.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    if (this.formChangeNumber.controls.digitTop.value) {
        for(let i=0;i<this.dataInputTop.data.length;i++)
        {
          if(this.dataInputTop.data[i]['lottoNumber'] == this.formChangeNumber.controls.digitTop.value)
          {
            hasTopNumber = true
            
            break
          }

        }
      }
      if (this.formChangeNumber.controls.digitBot.value) {
        let hasNumber = false
        for(let i=0;i<this.dataInputBot.data.length;i++)
        {
          if(this.dataInputBot.data[i]['lottoNumber'] == this.formChangeNumber.controls.digitBot.value)
          {
            hasBotNumber = true
            
            break
          }

        }
      }
      if(hasTopNumber && hasBotNumber)
      {
        DialogSweetAlertService.opentModalSweetAlertConfirm('Status Input Number','ยืนยันการกรอกข้อมูลหรือไม่', () => {
          this.formChangeNumber.controls.numberNo16.setValue(this.lottoNo16)
          this.formChangeNumber.controls.lottoResult.setValue(this.lottoResult)
          this.formChangeNumber.controls.sumNumber.setValue(this.sumNumber)
          this.httpBeanService.doPost(`${URL.SUBMIT_MANUAL_NUMBER}`,this.formChangeNumber.getRawValue()).subscribe((res)=>{
            if (res.data === "HAS_APPROVE") {
              DialogSweetAlertService.opentModalSweetAlertError('Status Input Number','รายการนี้ได้ถูกบันทึกไปเรียบร้อยแล้ว ไม่สามารถบันทึกซ้ำได้')
            }
            else if(res.data === "HAS_REJECT")
            {
              DialogSweetAlertService.opentModalSweetAlertError('Status Input Number','รายการนี้มีจำนวนผู้ยิงไม่ครบ 16 คน')
            }
            else if(res.status == MessageService.MSG.SUCCESS && res.data.length>0)
            {
              DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.SAVE.SUCCESS);
              this.ngOnInit();
              this.router.navigate(["lotto-settings/lotto-yeekee-approved"]);
            }
          })
        });
        
      }
      else if(!hasBotNumber)
      {
        DialogSweetAlertService.opentModalSweetAlertError('Status Input Number ','เลข 2 ตัวล่างที่คุณกรอก ไม่ตรงตามเงื่อนไขผลกำไร')
      }
      else if(!hasTopNumber)
      {
        DialogSweetAlertService.opentModalSweetAlertError('Status Input Number ','เลข 3 ตัวบนที่คุณกรอก ไม่ตรงตามเงื่อนไขผลกำไร')
      }
     

  }

  createForm() {
    this.formChangeNumber = this.forbuilder.group({
      sumNumber: this.sumNumber,
      numberNo16: this.lottoNo16,
      lottoResult: this.lottoResult,
      digitBot: [null,[Validators.required]],
      digitTop: [null,[Validators.required]],
      installment: this.installment,
      lottoClassCode: this.classCode,
      roundNumber: this.roundNumber,
    });
  }
}
