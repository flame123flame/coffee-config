import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassConstant } from 'src/app/constant/filename.constant';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';

const URL = {
  SUB_MIT_RESULT: 'lotto-result/submit-manual-lotto-result',
  SYNC_LOTTO_RESULT: 'lotto-result/sync-lotto-result'
};


@Component({
  selector: 'app-lotto-result',
  templateUrl: './lotto-result.component.html',
  styleUrls: ['./lotto-result.component.scss']
})

export class LottoResultComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private httpService: BaseService,
    private httpBean: BeanService,
    private activateRoute: ActivatedRoute,
    private formBuilder: FormBuilder,) {

  }

  className;
  classCode;
  formAddresult: FormGroup;

  loading = false;

  showFrontBot = false;

  ngOnInit(): void {
    const code = this.activateRoute.snapshot.queryParams;
    this.className = code.className
    this.classCode = code.classCode
    this.setFromAddresult()
  }

  setFromAddresult() {
    this.formAddresult = this.formBuilder.group({
      classCode: [this.classCode],
      installment: ['', Validators.required],
      digit3Top: ['', Validators.required],
      digit3Front1: [''],
      digit3Front2: [''],
      digit3Bot1: [''],
      digit3Bot2: [''],
      digit2Bot: ['', Validators.required],
      digit3Front: [[]],
      digit3Bot: [[]],
    });

    if (ClassConstant.thaiGv === this.classCode) {
      this.showFrontBot = true;

      this.formAddresult.controls.digit3Front1.setValidators([Validators.required]);
      this.formAddresult.controls.digit3Front1.updateValueAndValidity;

      this.formAddresult.controls.digit3Front2.setValidators([Validators.required]);
      this.formAddresult.controls.digit3Front2.updateValueAndValidity;

      this.formAddresult.controls.digit3Bot1.setValidators([Validators.required]);
      this.formAddresult.controls.digit3Bot1.updateValueAndValidity;

      this.formAddresult.controls.digit3Bot2.setValidators([Validators.required]);
      this.formAddresult.controls.digit3Bot2.updateValueAndValidity;
    }
    else
    {
      this.showFrontBot = false;
      this.formAddresult.controls.digit3Front1.setValue(null)
      this.formAddresult.controls.digit3Front1.setValidators([]);
      this.formAddresult.controls.digit3Front1.updateValueAndValidity;

      this.formAddresult.controls.digit3Front2.setValue(null)
      this.formAddresult.controls.digit3Front2.setValidators([]);
      this.formAddresult.controls.digit3Front2.updateValueAndValidity;

      this.formAddresult.controls.digit3Bot1.setValue(null)
      this.formAddresult.controls.digit3Bot1.setValidators([]);
      this.formAddresult.controls.digit3Bot1.updateValueAndValidity;

      this.formAddresult.controls.digit3Bot2.setValue(null)
      this.formAddresult.controls.digit3Bot2.setValidators([]);
      this.formAddresult.controls.digit3Bot2.updateValueAndValidity;
    }
  }

  onSubmit() {
    /** check form */

    const controls = this.formAddresult.controls;
    if (this.formAddresult.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    if (this.formAddresult.controls.installment.value.length != 8) {
      DialogSweetAlertService.opentModalSweetAlertError('ระบุข้อมูลไม่ถูกต้อง', 'กรุณาระบุงวดให้ถูกต้อง')
      return;
    }
    if (this.loading) return;
    this.loading = true;
    const instanst = this.formAddresult.controls.installment.value
    this.formAddresult.controls.digit3Front.setValue([])
    this.formAddresult.controls.digit3Bot.setValue([])

    this.formAddresult.controls.digit3Front.value.push(this.formAddresult.controls.digit3Front1.value)
    this.formAddresult.controls.digit3Front.value.push(this.formAddresult.controls.digit3Front2.value)
    this.formAddresult.controls.digit3Bot.value.push(this.formAddresult.controls.digit3Bot1.value)
    this.formAddresult.controls.digit3Bot.value.push(this.formAddresult.controls.digit3Bot1.value)
    const installmentStr = `${instanst.substring(4, 8)}-${instanst.substring(2, 4)}-${instanst.substring(0, 2)}`;
    console.log(this.formAddresult)

    this.httpBean.doPost(URL.SUB_MIT_RESULT, { ...this.formAddresult.value, installment: installmentStr }).subscribe(res => {
      this.loading = false;

      if (res.data.includes("BAD_INSTALLMENT")) {
        const instr = res.data.split('BAD_INSTALLMENT:')[1];
        const listIn = instr.split('-');
        const intBad = `${listIn[2]}-${listIn[1]}-${listIn[0]}`
        DialogSweetAlertService.opentModalSweetAlertError('Submit Lotto Data Status', `งวด ${intBad} ไม่ถูกต้อง`);
      }
      else if (res.data === "HAS_APPROVED") {
        DialogSweetAlertService.opentModalSweetAlertError('Submit Lotto Data Status', `งวดนี้ Submit ข้อมูลนี้ไปเเล้ว`);
      }
      else if (res.data === "HAS_PENDING") {
        DialogSweetAlertService.opentModalSweetAlertError('Submit Lotto Data Status', `งวดนี้ Submit ข้อมูลนี้ไปเเล้ว กรุณารอการ Approve`);
      }
      else if (res.data === "FAILED_API_DATA") {
        DialogSweetAlertService.opentModalSweetAlertError('Submit Lotto Data Status', `ไม่สามารถทำการเชื่อมต่อ API ได้`);
      } else if (res.status && res.data.length > 30) {

        DialogSweetAlertService.opentModalSweetAlertSuccess('Submit Lotto Data Status', 'บันทึกข้อมูลสำเร็จ');

        console.log(res)
        this.router.navigate(['lotto-settings/lotto-approved-detail'],
          {
            queryParams: {
              classCode: this.classCode,
              className: this.className,
              installment: installmentStr,
              codeGroup: res.data,
            }
          });
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('Submit Lotto Data Status', 'เกิดข้อผิดพลาดบันทึกข้อมูลไม่สำเร็จ');
      }
    });
  }

  // goDetail(installment, codeGroup) {
  //   this.router.navigate(['lotto-settings/lotto-government', {
  //     classCode: this.classCode,
  //     installment,
  //     codeGroup
  //   }]);
  // }

  goBack() {
    this.router.navigate(['lotto-settings/lotto-government']);
  }

  getSyncLottoResult() {
    // console.log($event.lottoClassCode)
    //   this.router.navigate(['lotto-settings/lotto-result-add'],
    //   { queryParams: { classCode: $event.lottoClassCode, className: $event.className } });

    this.httpBean.doGet(`${URL.SYNC_LOTTO_RESULT}?lottoClassCode=${this.classCode}`).subscribe(res => {
      if (res.data.includes("BAD_INSTALLMENT")) {
        const instr = res.data.split('BAD_INSTALLMENT:')[1];
        const listIn = instr.split('-');
        const intBad = `${listIn[2]}-${listIn[1]}-${listIn[0]}`
        DialogSweetAlertService.opentModalSweetAlertError('Sync Lotto Data Status', `งวด ${intBad} ไม่ถูกต้อง`);
      }
      else if (res.data === "HAS_APPROVED") {
        DialogSweetAlertService.opentModalSweetAlertError('Sync Lotto Data Status', `งวดนี้ Sync ข้อมูลนี้ไปเเล้ว`);
      }
      else if (res.data === "HAS_PENDING") {
        DialogSweetAlertService.opentModalSweetAlertError('Sync Lotto Data Status', `งวดนี้ Sync ข้อมูลนี้ไปเเล้ว กรุณารอการ Approve`);
      }
      else if (res.data === "FAILED_API_DATA") {
        DialogSweetAlertService.opentModalSweetAlertError('Sync Lotto Data Status', `ไม่สามารถทำการเชื่อมต่อ API ได้`);
      }
      else if (res.data === "NOT_HAS_CLASS") {
        DialogSweetAlertService.opentModalSweetAlertError('Sync Lotto Data Status', `ไม่มี API สำหรับหวยนี้`);
      }
      else if (MessageService.MSG.SUCCESS === res.status && res.data.length > 30) {
        DialogSweetAlertService.opentModalSweetAlertSuccess('Sync Lotto Data Status', 'บันทึกข้อมูลสำเร็จ');
        const thisDate = new Date();
        const dateStr = `${thisDate.getFullYear()}-${thisDate.getMonth().toString().padStart(2, '0')}-${thisDate.getDate().toString().padStart(2, '0')}`;
        console.log(res)
        this.router.navigate(['lotto-settings/lotto-approved-detail?' + res.data],
          {
            queryParams: {
              classCode: this.classCode,
              className: this.className,
              installment: dateStr,
              codeGroup: res.data,
            }
          });
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('Sync Lotto Data Status', 'เกิดข้อผิดพลาดบันทึกข้อมูลไม่สำเร็จ');
      }
    });
  }






}
