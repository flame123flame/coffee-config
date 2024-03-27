import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';

const URL = {
  SAVE_PRIZE: 'add-yeekee/add-lotto-yeekee-prize',
  GET_PRIZE_BY_CODE: 'add-yeekee/get-yeekee-prize-setting',
  DELETE_PRIZE_BY_ID: 'add-yeekee/delete-yeekee-prize-by-id'


}
export class MaxMinList {
  // msdLottoKindCode: string;
  minimumTrans: number;
  maximumTrans: number;
  maximumUsername: number;
  msdLottoKindCode: string;
  lottoClassCode: string;
  lottoGroupCode: string;
  vipCode: string; //list?

}
export class VipGroupList {
  code: string;
  name: string; //list?
}

@Component({
  selector: 'app-yeekee-add-prize',
  templateUrl: './yeekee-add-prize.component.html',
  styleUrls: ['./yeekee-add-prize.component.scss']
})


export class YeekeeAddPrizeComponent implements OnInit {

  vipGroupList: VipGroupList[] = [];

  displayedColumns: any = [
    'vipCode',
    'digit3top',
    'digit3swap',
    'digit2top',
    'digit2bot',
    'digit1top',
    'digit1bot',
    'action',
  ];

  lottoMaxMinList: MaxMinList[] = [];
  title = '';
  lottoClassCode: any;
  msdLottoKindCode: any;
  msdLottoKindName = '';
  lottoGroupCode = '';

  dataSourceX = new BehaviorSubject<AbstractControl[]>([]);
  rowsData: FormArray = this.formBuilder.array([]);
  formGroup: FormGroup = this.formBuilder.group({ data: this.rowsData });

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private httpBaseService: BaseService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.routeParam.queryParams.subscribe(data => {
      if (data) {
        this.title = data.className;
        this.lottoClassCode = data.classCode;
        this.lottoGroupCode = data.groupCode;
        this.msdLottoKindCode = data.msdLottoKindCode;
        this.msdLottoKindName = data.msdLottoKindName;
        this.getPrizeByCode(this.lottoClassCode);
        // this.groupLevelList();
        // this.getMinMax(this.lottoClassCode, this.msdLottoKindCode, this.lottoGroupCode);
      }
    });
    console.log(this.formGroup.value);
  }

  emptyTable() {
    while (this.rowsData.length !== 0) {
      this.rowsData.removeAt(0);
    }
  }

  addRow() {

    const row = this.formBuilder.group({
      digit3top: [null, [Validators.required, Validators.min(1)]],
      digit3swap: [null, [Validators.required, Validators.min(1)]],
      digit2top: [null, [Validators.required, Validators.min(1)]],
      digit2bot: [null, [Validators.required, Validators.min(1)]],
      digit1top: [null, [Validators.required, Validators.min(1)]],
      digit1bot: [null, [Validators.required, Validators.min(1)]],

      vipCode: [null, Validators.required],
      lottoClassCode: [this.lottoClassCode],

    });
    this.rowsData.push(row);

    this.updateView();
  }
  dropRow(element, index) {
    
    if (element.value.prizeSettingId != null) {
      console.log(element.value.prizeSettingId)
      
      // delete
      DialogSweetAlertService.opentModalSweetAlertConfirm('ยืนยันการลบข้อมูล', 'คุณต้องการยืนยันลบข้อมูลนี้หรือไม่', () => {

        console.log(this.formGroup.value.data)
        this.httpBeanService.doPost(URL.DELETE_PRIZE_BY_ID,element.value.prizeSettingId).subscribe(res => {
        if (res.status === 'SUCCESS') {
  
        this.formGroup.value.data.splice(index, 1);
        this.dataSourceX.value.splice(index, 1);
        this.formGroup.controls.data.updateValueAndValidity();
        this.updateView();
          }
        });
      });
      
    }
    else {

      this.formGroup.value.data.splice(index, 1);
      this.dataSourceX.value.splice(index, 1);
      this.formGroup.controls.data.updateValueAndValidity();
      this.updateView();
    }
  }

  updateView() {
    this.dataSourceX.next(this.rowsData.controls);
  }

  groupLevelList() {
    this.httpBaseService.doGet('groupLevel/get-dropdown-group').subscribe(res => {
      console.log(res);
      res.data.forEach(element => {
        if (this.lottoMaxMinList.length >= 0 && this.vipGroupList.length === 0) {
          this.vipGroupList.push(
            // set default
            {
              code: 'DEFAULT',
              name: 'DEFAULT',
            },
            // set loop first 
            {
              code: element.groupCode,
              name: element.groupName,
            }
          );
        }
        else {
          this.vipGroupList.push(
            {
              code: element.groupCode,
              name: element.groupName,
            }
          );
        }

      });
    });
  }

  onSave() {
    console.log(this.formGroup);
    console.log(this.rowsData)
    /** check form */

    const controls = this.formGroup.controls;
    if (this.formGroup.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    this.httpBeanService.doPost(URL.SAVE_PRIZE, this.formGroup.value.data).subscribe(res => {
      console.log(res);
      if (res.status === 'SUCCESS') {
        this.router.navigate(['lotto-settings/lotto-yeekee/'])
      }
    });

  }

  onDelete(id) {
    console.log()
  }

  onCancel(): void {
    this.router.navigate(['lotto-settings/lotto-yeekee']);
  }

  getPrizeByCode(classCode) {

    this.httpBeanService.doGet(`${URL.GET_PRIZE_BY_CODE}?lottoClassCode=${classCode}`).subscribe(res => {
      console.log(res);
      if (res.data.length != 0) {
        res.data.forEach((element, i) => {
          const row = this.formBuilder.group({
            digit3top: [element.digit3top, [Validators.required, Validators.min(1)]],
            digit3swap: [element.digit3swap, [Validators.required, Validators.min(1)]],
            digit2top: [element.digit2top, [Validators.required, Validators.min(1)]],
            digit2bot: [element.digit2bot, [Validators.required, Validators.min(1)]],
            digit1top: [element.digit1top, [Validators.required, Validators.min(1)]],
            digit1bot: [element.digit1bot, [Validators.required, Validators.min(1)]],
            vipCode: [element.vipCode, Validators.required],
            prizeSettingCode: [element.prizeSettingCode, Validators.required],
            prizeSettingId: [element.prizeSettingId, Validators.required],
            lottoClassCode: [element.lottoClassCode, Validators.required],
            lottoGroupDtlCode: [element.lottoGroupDtlCode, Validators.required],

          });

          this.rowsData.push(row);
        });
      }
      else if (res.data.length == 0) {

        const row = this.formBuilder.group({
          digit3top: [null, [Validators.required, Validators.min(1)]],
          digit3swap: [null, [Validators.required, Validators.min(1)]],
          digit2top: [null, [Validators.required, Validators.min(1)]],
          digit2bot: [null, [Validators.required, Validators.min(1)]],
          digit1top: [null, [Validators.required, Validators.min(1)]],
          digit1bot: [null, [Validators.required, Validators.min(1)]],
          vipCode: ['DEFAULT', Validators.required],
          lottoClassCode: [this.lottoClassCode, Validators.required],

        });
        this.rowsData.push(row);
      }
      this.groupLevelList();
      this.updateView();
    });
  }

  getList(vipCode) {
    const listFilter = this.vipGroupList.filter((element) => {
      const selected = this.formGroup.value.data.filter((selected) => {
        return selected.vipCode === element.code;
      });
      return !selected.length || element.code === vipCode;
    });
    return listFilter;
  }

}
