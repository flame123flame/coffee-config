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

class dataset {
  timeSellCode: string = null;
  lottoCode: string = null;
  dateStart = '1';
  dateEnd = '1';
  timeStart: string = null;
  timeEnd: string = null;
}

const URL = {
  LOTTO_ADD: 'add-lotto/add-lotto-time',
  LOTTO_EDIT: 'add-lotto/edit-lotto-time',
  GET_BY_CODE: 'add-lotto/get-lotto-time-by-code/',
  DELETE_TIME: 'add-lotto/delete-prize-setting/',
  AFFILIATE_LIST: 'affiliate-group/get-affiliate-group-all',
  GROUP_LIST: 'groupLevel/getAllGroupLevel'
};

@Component({
  selector: 'app-lotto-stock-add.component',
  templateUrl: './lotto-stock-add.component.html',
  styleUrls: ['./lotto-stock-add.component.scss']
})
export class LottoStockAddComponent implements OnInit {


  data: any = [];
  formAddLotto: FormGroup;
  timeSell = [];
  DataLotto = [];
  code: any = null;
  number = [];
  LOTTO_CODE = LottoConstants.LOTTO_STOCK;
  disable = false;
  type = 'DAILY';

  groupList = [];
  affiliateList = [];
  fileName = '';
  file = '';
  tmp: any = '';
  isMeridian = false;
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
    private route: ActivatedRoute
  ) {
    this.setFromAddLotto();
  }

  ngOnInit(): void {
    this.getGroupList();
    this.getAffiliateList();
    this.inputNumber();

    this.route.params.subscribe(prams => {
      this.data = prams
      console.log(prams)
    })

    const code1 = this.activateRoute.snapshot.queryParams.lottoCategoryCode;
    console.log(code1)

    const code = this.activateRoute.snapshot.queryParams.lottoClassCode;
    if (code != null) {
      this.getByCode(code);
      this.code = code;
    }
    this.checkDisable();

    // const code1 = this.activateRoute.snapshot.queryParams.lottoCategoryCode;
    // console.log(code1, code)

  }

  setFromAddLotto() {
    this.formAddLotto = this.formBuilder.group({
      lottoClassCode: ['', Validators.required],
      lottoClassName: ['', Validators.required],
      typeInstallment: ['DAILY'],
      ruleDes: ['', Validators.required],
      prefixCode: ['', Validators.required],
      countRefund: ['', Validators.required],
      lottoClassId: [''],
      lottoCategoryCode: [this.LOTTO_CODE],
      timeAfterBuy: ['', Validators.required],
      timeBeforeLotto: ['', Validators.required],
      lottoClassColor: ['', Validators.required],
      lottoClassImg: ['', Validators.required],
      timeSell: this.formBuilder.array([]),
      groupList: [null],
      affiliateList: [null]
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



    if (this.checkFrom() == false) {
      if (this.formAddLotto.value.typeInstallment === '24_HOUR') {
        this.formAddLotto.value.timeSell = [];
        if (this.code == null) {
          const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result === 'SAVE') {
              // Save Max/Min Api

              this.httpBean.doPost(URL.LOTTO_ADD, this.formAddLotto.value).subscribe(data => {
                if (MessageService.MSG.SUCCESS === data.status) {
                  this.router.navigate(['lotto-settings/lotto-stock']);
                }
                else {
                  alert(data.status);
                  this.formAddLotto.controls.timeSell.setValue([]);
                }
              });
            }
          });

        } else {
          const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result === 'SAVE') {
              // Save Max/Min Api
              this.httpBean.doPost(URL.LOTTO_EDIT, this.formAddLotto.value).subscribe(data => {
                this.router.navigate(['lotto-settings/lotto-stock']);
              });
            }
          });
        }
      }
      else if (this.formAddLotto.value.typeInstallment === 'MONTHLY' || this.formAddLotto.value.typeInstallment === 'DAILY') {
        if (this.formAddLotto.value.timeSell.length !== 0) {
          if (this.code == null) {
            const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              if (result === 'SAVE') {
                // Save Max/Min Api
                this.httpBean.doPost(URL.LOTTO_ADD, this.formAddLotto.value).subscribe(data => {
                  if (MessageService.MSG.SUCCESS === data.status) {
                    this.router.navigate(['lotto-settings/lotto-stock']);
                  }
                  else {
                    alert(data.status);
                    this.formAddLotto.controls.timeSell.setValue([]);
                  }
                });
              }
            });

          } else {
            const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              if (result === 'SAVE') {
                // Save Max/Min Api
                this.httpBean.doPost(URL.LOTTO_EDIT, this.formAddLotto.value).subscribe(data => {
                  this.router.navigate(['lotto-settings/lotto-stock']);
                });
              }
            });
          }
        }
        else {
          const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'OTHER', topic: 'No data', content: 'Please go to add Date and Time' }, width: '100' });
          dialogRef.afterClosed().subscribe(result => {
            console.log('No data: Please go to add Date and Time');
          });
        }
      }

      // if (this.code == null) {
      //   const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
      //   dialogRef.afterClosed().subscribe(result => {
      //     console.log('The dialog was closed');
      //     if (result === 'SAVE') {
      //       // Save Max/Min Api
      //       // if (this.formAddLotto.value.typeInstallment === '24_HOUR') {
      //       //   this.formAddLotto.value.timeSell = [];
      //       // }
      //       this.httpBean.doPost(URL.LOTTO_ADD, this.formAddLotto.value).subscribe(data => {
      //         if (MessageService.MSG.SUCCESS === data.status) {
      //           this.router.navigate(['lotto-settings/lotto-government']);
      //         }
      //         else {
      //           alert(data.status);
      //           this.formAddLotto.controls.timeSell.setValue([]);
      //         }
      //       });
      //     }
      //   });

      // } else {
      //   const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
      //   dialogRef.afterClosed().subscribe(result => {
      //     console.log('The dialog was closed');
      //     if (result === 'SAVE') {
      //       // Save Max/Min Api
      //       this.httpBean.doPost(URL.LOTTO_EDIT, this.formAddLotto.value).subscribe(data => {
      //         this.router.navigate(['lotto-settings/lotto-government']);
      //       });
      //     }
      //   });
      // }
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
    this.httpBean.doGet(URL.GET_BY_CODE + code).subscribe(data => {

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
        timeSell: [],
        groupList: data.data.groupList ? data.data.groupList.split(',') : null,
        affiliateList: data.data.affiliateList ? data.data.affiliateList.split(',') : null
      });

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
    if (timeCode) {
      const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'DELETE') {
          // delete
          this.httpBean.doDelete(URL.DELETE_TIME + timeCode).subscribe(data => {
            if (MessageService.MSG.SUCCESS === data.status) {

              const tmp = this.formAddLotto.controls['timeSell'];
              tmp['controls'].splice(i, 1);
              tmp['value'].splice(i, 1);
            }
          });
        }
      });

    }
    else {
      const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'DELETE') {
          // delete
          this.removeForm(i);
        }
      });
    }
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
    this.router.navigate(['lotto-settings/lotto-stock']);
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
}