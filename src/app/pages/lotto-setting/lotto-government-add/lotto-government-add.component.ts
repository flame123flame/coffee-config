import { BaseService } from './../../../service/BaseService.service';
import { BeanService } from './../../../service/BeanService.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LottoConstants } from '../lotto-constants/lotto-constants';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as moment from 'moment';
import { MessageService } from 'src/app/service/message.service';
import { LottoConfigDialogConfirmComponent } from '../lotto-config/lotto-config-dialog-confirm/lotto-config-dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';

class dataset {
  timeSellCode: string = null;
  lottoCode: string = null;
  dateStart = '1';
  dateEnd = '1';
  timeStart: string = null;
  timeEnd: string = null;
}

const URL = {
  LOTTO_ADD: 'draft-lotto-class/add-lotto-time',
  LOTTO_EDIT: 'draft-lotto-class/add-lotto-time',
  GET_BY_DRAFT: 'draft-lotto-class/get-lotto-time-by-code/',
  GET_LIST_APPROVE: 'approve-draft-lotto-class/get-draft-approve-class',
  SUBMIT_APPROVE: 'approve-draft-lotto-class/approve-config-class',

  GET_BY_CODE: 'add-lotto/get-lotto-time-by-code/',
  // LOTTO_ADD: 'add-lotto/add-lotto-time',
  // LOTTO_EDIT: 'add-lotto/edit-lotto-time',
  // GET_BY_CODE: 'add-lotto/get-lotto-time-by-code/',
  DELETE_TIME: 'add-lotto/delete-prize-setting/',
  AFFILIATE_LIST: 'affiliate-group/get-affiliate-group-all',
  GROUP_LIST: 'groupLevel/getAllGroupLevel'


};

@Component({
  selector: 'app-lotto-government-add',
  templateUrl: './lotto-government-add.component.html',
  styleUrls: ['./lotto-government-add.component.scss']
})
export class LottoGovernmentAddComponent implements OnInit {
  formAddLotto: FormGroup;
  timeSell = [];
  DataLotto = [];
  code: any = null;
  number = [];
  disable = false;
  type = 'DAILY';

  groupList = [];
  affiliateList = [];
  fileName = '';
  file = '';
  tmp: any = '';
  isMeridian = false;
  isDraft = false;
  draftCode = false;
  dataDraftShow: any;
  listApprove = [];
  category;
  actionSettingApp: ActionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: false,
    hideDetail: false,
  });
  readonly trApprove = [
    'id',
    'createdBy',
    'createdAt',
    'isApprove',
  ];
  columnsApprove: any = [
    { header: '#', field: 'id' },
    { header: 'Username', field: 'createdBy' },
    { header: 'Approve At', field: 'createdAt' },
    { header: 'Is Approve', field: 'isApprove' },
  ];

  // mytime: Date = new Date();
  config: AngularEditorConfig = {
    height: '200px',
  };

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private httpService: BaseService,
    private httpBean: BeanService,
    private activateRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.category = this.activateRoute.snapshot.queryParams.lottoCategoryCode;
    if(!this.activateRoute.snapshot.queryParams.lottoCategoryCode)
    {
      this.category = this.activateRoute.snapshot.queryParams.category;
    }
    this.setFromAddLotto();
  }

  ngOnInit(): void {
    console.log(this.activateRoute.snapshot.queryParams)
    this.getGroupList();
    this.getAffiliateList();
    this.inputNumber();
    const code = this.activateRoute.snapshot.queryParams.lottoClassCode;
    this.isDraft = this.activateRoute.snapshot.queryParams.isDraft;
    this.draftCode = this.activateRoute.snapshot.queryParams.draftCode;
    if (this.isDraft) {
      this.getListApprove();
    }
    if (code != null) {
      this.getByCode(code);
      this.code = code;
    }
    this.checkDisable();
  }

  setFromAddLotto() {
    this.formAddLotto = this.formBuilder.group({
      lottoClassCode: ['', Validators.required],
      lottoClassName: ['', Validators.required],
      typeInstallment: ['DAILY'],
      ruleDes: ['DESCITION'],
      prefixCode: ['', Validators.required],
      countRefund: ['', Validators.required],
      remarkVersion: ['', Validators.required],
      lottoClassId: [''],
      lottoCategoryCode: [this.category],
      timeAfterBuy: ['', Validators.required],
      timeBeforeLotto: ['', Validators.required],
      lottoClassColor: ['', Validators.required],
      lottoClassImg: ['', Validators.required],
      timeSell: this.formBuilder.array([]),
      groupList: [null],
      affiliateList: [null],
      autoUpdateWallet: [false],
      ignoreWeekly: [false],
    });
    // this.formAddLotto.get('timeSell').setValidators(Validators.required);
    // this.formAddLotto.get('timeSell').updateValueAndValidity();
    this.getTimeSell.push(this.newTimeSell('DAILY'));
  }

  newTimeSell(typeInstallment): FormGroup {
    if (typeInstallment === 'DAILY') {
      console.log(typeInstallment);
      return this.formBuilder.group({
        timeSellCode: new FormControl(null),
        lottoCode: new FormControl(null),
        dateStart: new FormControl(null),
        dateEnd: new FormControl(null),
        timeStart: new FormControl(null, Validators.required),
        timeEnd: new FormControl(null, Validators.required),
      });
    }
    else if (typeInstallment === 'MONTHLY') {
      console.log(typeInstallment);
      return this.formBuilder.group({
        timeSellCode: new FormControl(null),
        lottoCode: new FormControl(null),
        dateStart: new FormControl(null, Validators.required),
        dateEnd: new FormControl(null, Validators.required),
        timeStart: new FormControl(null, Validators.required),
        timeEnd: new FormControl(null, Validators.required),
      });
    }
    else if (typeInstallment === '24_HOUR') {
      console.log(typeInstallment);
      return this.formBuilder.group({
        timeSellCode: new FormControl(null),
        lottoCode: new FormControl(null),
        dateStart: new FormControl(null),
        dateEnd: new FormControl(null),
        timeStart: new FormControl(null),
        timeEnd: new FormControl(null),
      });
    }

  }

  get getTimeSell(): FormArray {
    return this.formAddLotto.get('timeSell') as FormArray;
  }

  inputNumber() {
    for (let i = 1; i <= 31; i++) {
      this.number.push(i.toString());
    }
  }

  onSubmit() {
    this.formAddLotto.markAllAsTouched();
    this.formAddLotto.markAsDirty();

    this.formAddLotto.controls.timeSell.value.forEach(element => {
      element.timeOpen = (element.dateStart == null ? moment().format('D/M/Y') : element.dateStart) + ' ' + moment(element.timeStart).format('HH:mm:ss');
      element.timeClose = (element.dateEnd == null ? moment().format('D/M/Y') : element.dateEnd) + ' ' + moment(element.timeEnd).format('HH:mm:ss');
    });

    const sendValue = this.formAddLotto.value;
    sendValue.groupList ? sendValue.groupList = sendValue.groupList.join(',') : null;
    sendValue.affiliateList ? sendValue.affiliateList = sendValue.affiliateList.join(',') : null;



    if (!this.checkFrom()) {
      if (
        (this.formAddLotto.value.typeInstallment === 'MONTHLY' || this.formAddLotto.value.typeInstallment === 'DAILY')
        && !this.formAddLotto.value.timeSell.length) {
        const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'OTHER', topic: 'No data', content: 'Please go to add Date and Time' }, width: '100' });
        dialogRef.afterClosed().subscribe(result => {
          console.log('No data: Please go to add Date and Time');
        });
        return;
      }

      const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'SAVE') {
          // Save Max/Min Api
          this.httpBean.doPost(URL.LOTTO_ADD, this.formAddLotto.value).subscribe(data => {
            if (MessageService.MSG.SUCCESS === data.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess('สถานะการทำรายการ', 'ทำรายการสำเร็จ');
              if (this.category == LottoConstants.LOTTO_GOVERNMENT) {
                this.router.navigate(['lotto-settings/lotto-government']);
              } else if (this.category == LottoConstants.LOTTO_STOCK) {
                this.router.navigate(['lotto-settings/lotto-stock']);
              }
            }
            else {
              DialogSweetAlertService.opentModalSweetAlertError('สถานะการทำรายการ', 'ทำรายการไม่สำเร็จ');
            }
          });
        }
      });

    }
  }

  toggleMode(): void {
    this.isMeridian = !this.isMeridian;
  }

  onChange($event) {
    this.formAddLotto.get('ruleDes').patchValue($event);
  }

  onChangeTypeInstallment(event) {
    const timeSell = this.formAddLotto.get('timeSell');
    const typeInstallment = event;

    if (typeInstallment === 'DAILY') {
      this.formAddLotto.get('timeSell').setValidators(Validators.required);
      this.formAddLotto.get('timeSell').updateValueAndValidity();
    }
    else if (typeInstallment === 'MONTHLY') {
      this.formAddLotto.get('timeSell').setValidators(Validators.required);
      this.formAddLotto.get('timeSell').updateValueAndValidity();
    } else if (typeInstallment === '24_HOUR') {
      this.formAddLotto.get('timeSell').clearValidators();
      this.formAddLotto.get('timeSell').clearAsyncValidators();
      this.formAddLotto.get('timeSell').updateValueAndValidity();
    }

    this.getTimeSell.controls.forEach((val: FormGroup) => {
      if (typeInstallment === 'DAILY') {
        console.log(typeInstallment);
        val.get('timeSellCode').clearValidators();
        val.get('lottoCode').clearValidators();
        val.get('dateStart').clearValidators();
        val.get('dateEnd').clearValidators();

        val.get('timeSellCode').clearAsyncValidators();
        val.get('lottoCode').clearAsyncValidators();
        val.get('dateStart').clearAsyncValidators();
        val.get('dateEnd').clearAsyncValidators();

        val.get('timeStart').setValidators(Validators.required);
        val.get('timeEnd').setValidators(Validators.required);

        val.get('timeSellCode').updateValueAndValidity();
        val.get('lottoCode').updateValueAndValidity();
        val.get('dateStart').updateValueAndValidity();
        val.get('dateEnd').updateValueAndValidity();
        val.get('timeStart').updateValueAndValidity();
        val.get('timeEnd').updateValueAndValidity();
      }
      else if (typeInstallment === 'MONTHLY') {
        console.log(typeInstallment);
        val.get('timeSellCode').clearValidators();
        val.get('lottoCode').clearValidators();

        val.get('timeSellCode').clearAsyncValidators();
        val.get('lottoCode').clearAsyncValidators();

        val.get('dateStart').setValidators(Validators.required);
        val.get('dateEnd').setValidators(Validators.required);
        val.get('timeStart').setValidators(Validators.required);
        val.get('timeEnd').setValidators(Validators.required);

        val.get('timeSellCode').updateValueAndValidity();
        val.get('lottoCode').updateValueAndValidity();
        val.get('dateStart').updateValueAndValidity();
        val.get('dateEnd').updateValueAndValidity();
        val.get('timeStart').updateValueAndValidity();
        val.get('timeEnd').updateValueAndValidity();
      }
      else if (typeInstallment === '24_HOUR') {
        console.log(typeInstallment);
        val.get('timeSellCode').clearValidators();
        val.get('lottoCode').clearValidators();
        val.get('dateStart').clearValidators();
        val.get('dateEnd').clearValidators();
        val.get('timeStart').clearValidators()
        val.get('timeEnd').clearValidators()

        val.get('timeSellCode').clearAsyncValidators();
        val.get('lottoCode').clearAsyncValidators();
        val.get('dateStart').clearAsyncValidators();
        val.get('dateEnd').clearAsyncValidators();
        val.get('timeStart').clearAsyncValidators();
        val.get('timeEnd').clearAsyncValidators();

        val.get('timeSellCode').updateValueAndValidity();
        val.get('lottoCode').updateValueAndValidity();
        val.get('dateStart').updateValueAndValidity();
        val.get('dateEnd').updateValueAndValidity();
        val.get('timeStart').updateValueAndValidity();
        val.get('timeEnd').updateValueAndValidity();
        // this.getTimeSell.removeAt(0);
      }
    });
    console.log(this.formAddLotto.controls['timeSell']);
  }

  getByCode(code) {
    this.httpBean.doGet(this.isDraft ? URL.GET_BY_DRAFT + this.draftCode : URL.GET_BY_CODE + code).subscribe(data => {

      this.formAddLotto.patchValue({
        lottoClassCode: data.data.lottoClassCode,
        lottoClassName: data.data.lottoClassName,
        typeInstallment: data.data.typeInstallment,
        ruleDes: data.data.ruleDes,
        lottoClassId: data.data.lottoClassId,
        timeAfterBuy: data.data.timeAfterBuy,
        timeBeforeLotto: data.data.timeBeforeLotto,
        lottoClassColor: data.data.lottoClassColor,
        lottoClassImg: data.data.lottoClassImg,
        prefixCode: data.data.prefixCode,
        countRefund: data.data.countRefund,
        autoUpdateWallet: data.data.autoUpdateWallet,
        ignoreWeekly: data.data.ignoreWeekly,
        remarkVersion: data.data.remarkVersion,
        timeSell: [],
        groupList: data.data.groupList ? data.data.groupList.split(',') : null,
        affiliateList: data.data.affiliateList ? data.data.affiliateList.split(',') : null
      });


      this.dataDraftShow = {
        ...data.data
        , createdAt: moment(data.data.createdAt).format('DD/MM/YYYY HH:mm:ss')
      };

      this.tmp = data.data.lottoClassImg;
      const dataTime = data.data.timeSell;
      if (dataTime.length !== 0) {
        this.getTimeSell.removeAt(0);
      }

      dataTime.forEach(element => {
        const data = this.formBuilder.group({
          timeSellCode: new FormControl(element.timeSellCode),
          lottoCode: new FormControl(null),
          dateStart: new FormControl(moment(element.timeOpen).format('D').toString() + '/01/2020'),
          dateEnd: new FormControl(moment(element.timeClose).format('D').toString() + '/01/2020'),
          timeStart: new FormControl(moment(element.timeOpen).format()),
          timeEnd: new FormControl(moment(element.timeClose).format()),
        });

        this.getTimeSell.push(data);
      });

      console.log(this.formAddLotto);


      this.checkDisable();
    });
  }

  removeTime(i, timeCode) {
    const tmp = this.formAddLotto.controls['timeSell'];
    tmp['controls'].splice(i, 1);
    tmp['value'].splice(i, 1);
    // if (timeCode) {
    //   const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     if (result === 'DELETE') {
    //       // delete
    //       this.httpBean.doDelete(URL.DELETE_TIME + timeCode).subscribe(data => {
    //         if (MessageService.MSG.SUCCESS === data.status) {

    //           const tmp = this.formAddLotto.controls['timeSell'];
    //           tmp['controls'].splice(i, 1);
    //           tmp['value'].splice(i, 1);
    //         }
    //       });
    //     }
    //   });

    // }
    // else {
    //   const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     if (result === 'DELETE') {
    //       // delete
    //       this.removeForm(i);
    //     }
    //   });
    // }
  }

  removeForm(i) {
    const tmp = this.formAddLotto.controls['timeSell'];
    tmp['controls'].splice(i, 1);
    tmp['value'].splice(i, 1);
    this.formAddLotto.controls['timeSell'].updateValueAndValidity();
    this.formAddLotto.controls['timeSell'].markAllAsTouched();
  }

  checkDisable() {
    if (this.formAddLotto.controls.lottoClassCode.value) {
      this.disable = true;
    }
  }

  goBack() {
    if (!this.isDraft) {
      if (this.category == LottoConstants.LOTTO_GOVERNMENT) {
        this.router.navigate(['lotto-settings/lotto-government']);
      } else if (this.category == LottoConstants.LOTTO_STOCK) {
        this.router.navigate(['lotto-settings/lotto-stock']);
      }
    } else {
      console.log(this.category)
      this.router.navigate(['lotto-settings/lotto-draft-class'], {
        queryParams: {
          category: this.category,
        }
      });
    }
  }

  getGroupList() {
    this.httpService.doGet(URL.GROUP_LIST).subscribe(data => {
      if (MessageService.MSG.SUCCESS === data.status) {
        this.groupList = data.data;
      }
    });
  }

  getAffiliateList() {
    this.httpService.doGet(URL.AFFILIATE_LIST).subscribe(data => {
      if (MessageService.MSG.SUCCESS === data.status) {
        this.affiliateList = data.data;
      }
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

  checkFrom() {
    if (this.formAddLotto.status == 'VALID') {
      return false;
    }
    else {
      return true;
    }
  }

  getListApprove() {
    this.httpBean.doPost(URL.GET_LIST_APPROVE, { draftCode: this.draftCode })
      .subscribe(res => {
        let count = 1;
        res.data.forEach(element => {
          element.id = count;
          element.isApprove = element.isApprove ? 'Approve' : 'Reject';
          element.createdAt = moment(element.createdAt).format('DD/MM/YYYY HH:mm:ss');
          count++;
        });
        this.listApprove = res.data;
      });
  }

  confirmApprove(isApprove) {
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      'ยืนยันการทำรายการ',
      `ยืนยัน ${isApprove ? 'Approve' : 'Reject'} รายการนี้`,
      () => {
        this.submitApprove(isApprove);
      }
    );
  }

  submitApprove(isApprove) {
    this.httpBean.doPost(URL.SUBMIT_APPROVE, {
      classCode: this.formAddLotto.value.lottoClassCode,
      draftCode: this.draftCode,
      isApprove,
    }).subscribe(res => {
      if (MessageService.MSG.SUCCESS === res.data) {
        DialogSweetAlertService.opentModalSweetAlertSuccess('ผลการทำรายการ', 'ทำรายการสำเร็จ');
      } else if (res.data === 'SUCCESS_APPROVED') {
        DialogSweetAlertService.opentModalSweetAlertError('ผลการทำรายการ', 'รายการนี้ Approve ครบจำนวนแล้ว');
      } else if (res.data === 'HAS_REJECT') {
        DialogSweetAlertService.opentModalSweetAlertError('ผลการทำรายการ', 'รายการนี้ถูก Reject ไปแล้ว');
      } else if (res.data === 'HAS_APPROVED') {
        DialogSweetAlertService.opentModalSweetAlertError('ผลการทำรายการ', 'คุณได้ทำรายการนี้ไปแล้ว');
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('ผลการทำรายการ', 'ทำรายการไม่สำเร็จ');
      }
      this.getListApprove();
    });
  }

}
