import { MessageService } from './../../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { ClassConstant } from 'src/app/constant/filename.constant';

const URL = {
  GET_LOTTO_RESULT_ALL: 'lotto-result/get-all-lotto-result',
  GET_APPROVE_GET_LIST: 'approve-result/list',
  SUBMIT_APPROVE_LIST: 'approve-result/submit'
};

@Component({
  selector: 'app-lotto-approved-detail',
  templateUrl: './lotto-approved-detail.component.html',
  styleUrls: ['./lotto-approved-detail.component.scss']
})

export class LottoApprovedDetailComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private httpService: BaseService,
    private httpBean: BeanService,
    private activateRoute: ActivatedRoute,
  ) { }

  codeGroup
  createdAt
  installment
  installmentStr
  classCode
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

  lottoResultDateList = {
    date1: "",
    date2: "",
    date3: "",
    date4: "",
    date5: "",
    date6: "",
    date7: "",
    date8: "",
  }

  displayedColumns: any = [
    'lottoName',
    'lottoNumber',

  ];

  displayedColumns2: any = [
    'username',
    'createdAt',
    'isApprove',

  ];

  ApproveSaveReq = {
    codeGroup: null,
    lottoClassCode: "",
    installment: "",
    isApprove: null
  }
  ApproveDataList = [];
  userRole = [];
  codeparam
  showFrontBot = false;
  lottoResultArray = [];
  ngOnInit(): void {
    this.getUserDetail()
    const code = this.activateRoute.snapshot.queryParams;
    this.codeparam = code

    const instanst = code.installment;
    this.installmentStr = `${instanst.substring(8, 10)}/${instanst.substring(5, 7)}/${instanst.substring(0, 4)}`;

    if (ClassConstant.thaiGv === this.classCode) {
      this.showFrontBot = true;
    }

    if (code != null) {
      this.reloadList(code)
      console.log(code.classCode)
      console.log(code.installment)
      console.log(code.codeGroup)
      this.classCode = code.classCode
      this.installment = code.installment
      this.codeGroup = code.codeGroup
    }
  }

  reloadList(event) {
    this.getAllLottoResult(event)
    this.getApprovedInfor(event)
  }

  getAllLottoResult(code) {
    this.httpBean.doGet(`${URL.GET_LOTTO_RESULT_ALL}/${code.codeGroup}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        // this.data=data
        this.lottoResultArray = []
        let lottoNumber1 = []
        let lottoNumber2 = []
        let lottoNumber3 = []
        let lottoNumber4 = []
        let lottoNumber5 = []
        let lottoNumber6 = []
        let lottoNumber7 = []
        let lottoNumber8 = []
        data.data.forEach(element => {
          this.createdAt = element.createdAt
          if (element.msdLottoKindCode == "3DIGIT_TOP") {
            lottoNumber1.push(element.lottoNumber)
            this.lottoResultList.digit3Top = lottoNumber1.join()

          }
          if (element.msdLottoKindCode == "3DIGIT_SWAPPED") {
            lottoNumber2.push(element.lottoNumber)
            this.lottoResultList.digit3Swap = lottoNumber2.join()
          }
          if (element.msdLottoKindCode == "1DIGIT_TOP") {
            lottoNumber3.push(element.lottoNumber)
            this.lottoResultList.digit1Top = lottoNumber3.join()
          }
          if (element.msdLottoKindCode == "3DIGIT_FRONT") {
            lottoNumber4.push(element.lottoNumber)
            this.lottoResultList.digit3Front = lottoNumber4.join()

          }
          if (element.msdLottoKindCode == "3DIGIT_BOT") {
            lottoNumber5.push(element.lottoNumber)
            this.lottoResultList.digit3Bot = lottoNumber5.join()

          }
          if (element.msdLottoKindCode == "2DIGIT_BOT") {
            lottoNumber6.push(element.lottoNumber)
            this.lottoResultList.digit2Bot = lottoNumber6.join()

          }
          if (element.msdLottoKindCode == "1DIGIT_BOT") {
            lottoNumber7.push(element.lottoNumber)
            this.lottoResultList.digit1Bot = lottoNumber7.join()

          }
          if (element.msdLottoKindCode == "2DIGIT_TOP") {
            lottoNumber8.push(element.lottoNumber)
            this.lottoResultList.digit2Top = lottoNumber8.join()
          }

        });

        this.lottoResultArray.push({ lottoName: "3 ตัวบน", lottoNumber: this.lottoResultList.digit3Top })
        this.lottoResultArray.push({ lottoName: "3 โต๊ด", lottoNumber: this.lottoResultList.digit3Swap })
        this.lottoResultArray.push({ lottoName: "3 หน้า", lottoNumber: this.lottoResultList.digit3Front })
        this.lottoResultArray.push({ lottoName: "3 ตัวล่าง", lottoNumber: this.lottoResultList.digit3Bot })
        this.lottoResultArray.push({ lottoName: "2 ตัวบน", lottoNumber: this.lottoResultList.digit2Top })
        this.lottoResultArray.push({ lottoName: "2 ตัวล่าง", lottoNumber: this.lottoResultList.digit2Bot })
        this.lottoResultArray.push({ lottoName: "วิ่งบน", lottoNumber: this.lottoResultList.digit1Top })
        this.lottoResultArray.push({ lottoName: "วิ่งล่าง", lottoNumber: this.lottoResultList.digit1Bot })
      }

    });
  }

  getApprovedInfor(event) {
    this.httpBean.doPost(URL.GET_APPROVE_GET_LIST + '/' + event.codeGroup, {}).subscribe(data => {
      this.ApproveDataList = data.data
      console.log(data)
    })
  }

  getUserDetail() {
    this.httpService.getUserDetail().subscribe(data => {

      data.data.role.forEach(element => {
        this.userRole.push(element.name)
      });
      console.log(this.userRole)
    })
  }

  getApprovedSubmit(event) {

    console.log(event)
    this.ApproveSaveReq.installment = this.installment
    this.ApproveSaveReq.lottoClassCode = this.classCode
    this.ApproveSaveReq.isApprove = event
    this.ApproveSaveReq.codeGroup = this.codeGroup
    this.httpBean.doPost(URL.SUBMIT_APPROVE_LIST, this.ApproveSaveReq).subscribe(data => {
      if (MessageService.MSG.SUCCESS === data.data) {
        DialogSweetAlertService.opentModalSweetAlertSuccess('Approve Status', 'บันทึกข้อมูลสำเร็จ');
      }
      if (data.data === 'HAS_2_APPROVED') {
        DialogSweetAlertService.opentModalSweetAlertError('Approve Status', 'รายการนี้มีผู้ Aprrove ครบแล้ว');
      }
      if (data.data === 'HAS_1_REJECTED') {
        DialogSweetAlertService.opentModalSweetAlertError('Approve Status', 'รายการนี้มีผู้ REJECT แล้ว');
      }
      if (data.data === 'YOU_HAS_APPROVED') {
        DialogSweetAlertService.opentModalSweetAlertError('Approve Status', 'คุณได้ทำการบันทึกข้อมูลนี้ไปแล้ว');
      }
      this.reloadList(this.codeparam);
    })

  }

}
