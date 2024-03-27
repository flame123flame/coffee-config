import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LottoConstants } from '../lotto-constants/lotto-constants';
import * as moment from 'moment';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';

const URL = {
  SAVE_YEEKEE: 'add-yeekee/add-lotto-yeekee',
  GET_BY_CODE: 'add-yeekee/get-lotto-yeekee-detail',
  EDIT_YEEKEE: 'add-yeekee/edit-lotto-yeekee'
}

@Component({
  selector: 'app-yeekee-add',
  templateUrl: './yeekee-add.component.html',
  styleUrls: ['./yeekee-add.component.scss']
})
export class YeekeeAddComponent implements OnInit {
  formAddLotto: FormGroup;
  category = LottoConstants.LOTTO_YEEKEE;

  columns: any = [
    { header: 'รอบที่', field: 'count' },
    { header: 'เวลาปิดรับ', field: 'timeClose' },

  ];

  tr: any = [
    'count',
    'timeClose',
  ];

  isDisable = true

  // File Name
  fileName;
  file;
  tmp;

  // Data Draft
  isDraft = false;
  dataDraftShow;
  countDetail = [];
  timeSell = [];
  disable = false;
  // Time
  // startTime: Date = moment().format('') ;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpBeanService: BeanService,
    private activateRoute:ActivatedRoute
  ) {
    this.setFromAddLotto();
    this.formAddLotto.controls.startTime.valueChanges
      .subscribe(time => { this.changeStartTime(); });
    this.formAddLotto.controls.countTime.valueChanges
      .subscribe(time => { this.changeStartTime(); });
    this.formAddLotto.controls.roundTime.valueChanges
      .subscribe(time => { this.changeStartTime(); });
    const code = this.activateRoute.snapshot.queryParams;
    console.log(code.lottoClassId)
    if(code.lottoClassId)
    { 
      this.getYeekeeByCode(code)
    }
  }
  ngOnInit(): void {
    this.calculate(this.formAddLotto.controls.countTime.value)
  }

  changeStartTime() {
    
    if(this.formAddLotto.controls.countTime.value!=0)
    {
      this.calculate(this.formAddLotto.controls.countTime.value)
    }
    else if(!this.formAddLotto.controls.countTime.value)
    {   
      this.countDetail =[];
    }
    
    // this.formAddLotto.patchValue({
    // });
  }


  onChange($event) {
    this.formAddLotto.get('ruleDes').patchValue($event);
  }

  newDate = new Date();
  setFromAddLotto() {
    this.formAddLotto = this.formBuilder.group({
      lottoClassCode: ['', Validators.required],
      lottoClassName: ['', Validators.required],
      typeInstallment: ['24_HR'],
      ruleDes: 'DESCRIPTION',
      prefixCode: ['', Validators.required],
      countRefund: ['', Validators.required],
      remarkVersion: ['', Validators.required],
      lottoClassId: [''],
      lottoCategoryCode: [this.category],
      timeAfterBuy: ['', Validators.required],
      timeBeforeLotto: ['', Validators.required],
      lottoClassColor: ['', Validators.required],
      lottoClassImg: ['', Validators.required],
      timeSell: [],
      groupList: [null],
      affiliateList: [null],
      autoUpdateWallet: [false],
      ignoreWeekly: [false],

      startTime: '06:00',
      countTime: [0, Validators.min(1)],
      roundTime: [0, Validators.min(1)],
      stopTime: [0, Validators.min(0)],
      hasBet: [0,Validators.min(0)],
      earningsPercent:[0,[Validators.min(0),Validators.max(100)]]
    });
  }

  preview(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    this.fileName = files[0].name;
    this.file = files[0];

    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.tmp = reader.result;
      this.formAddLotto.get('lottoClassImg').patchValue(this.tmp);
    };
  }

  goBack() {
    if (!this.isDraft) {
      if (this.category == LottoConstants.LOTTO_GOVERNMENT) {
        this.router.navigate(['lotto-settings/lotto-government']);
      } else if (this.category == LottoConstants.LOTTO_STOCK) {
        this.router.navigate(['lotto-settings/lotto-stock']);
      }
      else if(this.category == LottoConstants.LOTTO_YEEKEE)
      {
        this.router.navigate(['lotto-settings/lotto-yeekee']);
      }
    } else {
      this.router.navigate(['lotto-settings/lotto-draft-class'], {
        queryParams: {
          category: this.category,
        }
      });
    }
  }

  getByCode(code)
  {
    this.httpBeanService.doGet('').subscribe(data=>{

    })
  }

  calculate(number) {
    let getTime
    let getTime2
    let endtime
    let date
    let end
    let min = 0
    getTime = new Date()
    getTime2 = new Date()
    let stop
    end = moment(getTime2).set('hour', 6).set('m', 0).set('s', 0).add('d', 1)
    this.countDetail = []
    this.timeSell = []
    this.formAddLotto.controls.startTime.value
    for (let i = 0; i < number; i++) {
      date = moment(getTime)
      min += Number(this.formAddLotto.controls.roundTime.value)
      endtime = date.set('hour', 6).set('m', 0).set('s', 0).add('m', Number(min)).format('HH:mm')
      this.countDetail.push({ count: (i + 1).toString(), timeClose: endtime})
      stop = moment.duration(date.set('hour', 6).set('m', 0).set('s', 0).add('m', min).diff(end)).asMinutes()
      this.formAddLotto.controls.stopTime.setValue(1440 - stop)
      this.timeSell.push({timeOpen:moment(getTime).set('hour', 6).set('m', 0).set('s', 0).format('DD/MM/YYYY HH:mm:ss'),timeClose:moment(getTime).set('hour', 6).set('m', 0).set('s', 0).add('m', min).format('DD/MM/YYYY HH:mm:ss')})
    }
  }

  onSave() {
    console.log(this.timeSell)
    console.log(this.formAddLotto.controls.lottoClassId.value)
    /** check form */
    const controls = this.formAddLotto.controls;
    this.isDisable = true
    if (this.formAddLotto.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    else {
      this.isDisable = false
    }

    if (!this.isDisable) {
      this.formAddLotto.controls.timeSell.setValue(this.timeSell)
      this.formAddLotto.controls.startTime.setValue(moment(this.newDate).set('hour', 6).set('m', 0).set('s', 0))
      if(!this.formAddLotto.controls.lottoClassId.value)
      {
        this.httpBeanService.doPost(URL.SAVE_YEEKEE, this.formAddLotto.value).subscribe(res => {
          if(res.data.includes("ClassCode"))
          {
            DialogSweetAlertService.opentModalSweetAlertError('Create Lotto YEEKEE Status', `ClassCode: ${ this.formAddLotto.controls.lottoClassCode.value } มีอยู่ในระบบเเล้ว`);
          }
          else if(res.data.includes("PreFixCode"))
          {
            DialogSweetAlertService.opentModalSweetAlertError('Create Lotto YEEKEE Status', `PreFixCode: ${ this.formAddLotto.controls.prefixCode.value } มีอยู่ในระบบเเล้ว`);
          }
          else if(res.data.includes("บันทึกเรียบร้อยแล้ว"))
          {
            this.router.navigate(['lotto-settings/lotto-yeekee'])
          }
        });
      }
      else
      {
        this.httpBeanService.doPost(URL.EDIT_YEEKEE, this.formAddLotto.value).subscribe(res => {
          if(res.data.includes("ClassCode"))
          {
            DialogSweetAlertService.opentModalSweetAlertError('Create Lotto YEEKEE Status', `ClassCode: ${ this.formAddLotto.controls.lottoClassCode } มีอยู่ในระบบเเล้ว`);
          }
          else if(res.data.includes("PreFixCode"))
          {
            DialogSweetAlertService.opentModalSweetAlertError('Create Lotto YEEKEE Status', `PreFixCode: ${ this.formAddLotto.controls.prefixCode } มีอยู่ในระบบเเล้ว`);
          }
          else if(res.data.includes("แก้ไขเรียบร้อยแล้ว"))
          {
            this.router.navigate(['lotto-settings/lotto-yeekee'])
          }
        });
      }
      
    }
  }

  checkDisable() {
    console.log(this.formAddLotto.controls.lottoClassCode.value)
    console.log(this.formAddLotto.controls.lottoClassId.value)
    if (this.formAddLotto.controls.lottoClassCode.value && this.formAddLotto.controls.lottoClassId.value) {
      this.disable = true;
    }
  }

  getYeekeeByCode(code)
  {
    this.httpBeanService.doGet(`${URL.GET_BY_CODE}?lottoClassId=${code.lottoClassId}&lottoClassCode=${code.lottoClassCode}`).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.tmp = res.data.lottoClassImg
        this.formAddLotto.patchValue({
          lottoClassCode: res.data.lottoClassCode,
          lottoClassName: res.data.className,
          typeInstallment: '24_HR',
          ruleDes: res.data.ruleDes,
          prefixCode: res.data.prefixTransNumber,
          countRefund: res.data.countRefund,
          remarkVersion: '',
          lottoClassId: res.data.lottoClassId,
          lottoCategoryCode: res.data.lottoCategoryCode,
          timeAfterBuy: res.data.timeAfterBuy,
          timeBeforeLotto: res.data.timeBeforeLotto,
          lottoClassColor: res.data.lottoClassColor,
          lottoClassImg: res.data.lottoClassImg,
          timeSell: [],
          groupList: null,
          affiliateList: null,
          autoUpdateWallet: res.data.autoUpdateWallet,
          ignoreWeekly: false,
          startTime: '06:00',
          countTime: res.data.countTime,
          roundTime: res.data.roundTime,
          stopTime: res.data.stopTime,
          hasBet: res.data.hasBet,
          earningsPercent:res.data.earningsPercent
        })
      }
      this.checkDisable()
    });
    
  }
}
