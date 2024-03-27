import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BeanService } from 'src/app/service/BeanService.service';
import { LottoConfigDialogConfirmComponent } from '../lotto-config/lotto-config-dialog-confirm/lotto-config-dialog-confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

const URL = {
  GROUP_RISK_GET: 'group-risk2/get-group-risk-by-code'
}
export class LottoTypeList {
  kindCode: string;
}
export class LottoRiskList {
  level: string;
  // groupMaxRisk: number;
  // maxClose: number;
  groupDtlCode: string;
  // earningPercentUse: number;
  percentForLimit: number;
}

@Component({
  selector: 'app-lotto-config-add-group',
  templateUrl: './lotto-config-add-group.component.html',
  styleUrls: ['./lotto-config-add-group.component.scss']
})
export class LottoConfigAddGroupComponent implements OnInit {
  columns: any = [
    { header: 'Level', field: 'level', },
    // { header: 'Max Risk', field: 'groupMaxRisk', type: 'number' },
    { header: 'Earnings Percent Use', field: 'percentForLimit', type: 'number' },  //use percent for limit?
  ];

  tr: any = [
    'level',
    // 'groupMaxRisk',
    'percentForLimit',
    'action',
  ];

  displayedColumns: any = [
    'level',
    'percentForLimit',
    'action'
  ];

  displayedColumns2: any = [
    '#',
    'lottoType',
    'action',
  ];

  msdLottoKindTypeList = [];

  columns1: any = [
    { header: 'Lotto Type', field: 'kindCode', type: 'option', option: this.msdLottoKindTypeList },
  ];

  tr1: any = [
    'no',
    'kindCode',
    'action',
  ];

  isDisable = false;

  actionSetting: ActionSetting = new ActionSetting({

    hideEdit: false,
    showFunction: (element, i) => {
      if (i == 0) {
        return false;
      }
      return true;
    }
  });
  lottoTypeList: LottoTypeList[] = [
    // { kindCode: null, }
  ];
  lottoRiskList: LottoRiskList[] = [
  ];

  title: '';
  lottoClassCode: '';
  kindCodeList = [];
  groupRiskList = [];
  lottoGroupCode = '';
  boolean1 = false
  boolean2 = false

  lottoConfigModel = {
    groupName: null,
    groupMaxClose: null,
    groupEarningsPercent: null,
    // groupEarningsPercentClose: null,
    lottoClassCode: null,
    groupRiskList: [],
    kindCode: [],
  };


  dataSource: MatTableDataSource<Object>;

  listData: FormArray = this.formBuilder.array([]);
  kindData: FormArray = this.formBuilder.array([]);
  dataSourceX = new BehaviorSubject<AbstractControl[]>([]);
  dataSourceX2 = new BehaviorSubject<AbstractControl[]>([]);

  formGrouplottoConfig: FormGroup = this.formBuilder.group({
    groupCode: [''],
    groupName: [null, [Validators.required]],
    groupMaxClose: [null, [Validators.required, Validators.min(1)]],
    groupEarningsPercent: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
    // groupEarningsPercentClose: [null, [Validators.required, , Validators.min(1), Validators.max(100)]],
    lottoClassCode: [null,],
    groupRiskList: this.listData,
    kindCode: this.kindData,
  })

  constructor(
    private router: Router,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _location:Location
  ) {

    // this.formGrouplottoConfig.controls.groupEarningsPercentClose.setValidators([Validators.required, Validators.min(1), Validators.max(100), this.greaterThan('groupEarningsPercent')])
    // this.formGrouplottoConfig.controls.groupEarningsPercentClose.updateValueAndValidity()
    this.formGrouplottoConfig.controls.groupRiskList.setValidators(Validators.required)
    this.formGrouplottoConfig.controls.kindCode.setValidators(Validators.required)
    this.formGrouplottoConfig.controls.groupRiskList.updateValueAndValidity()
    this.formGrouplottoConfig.controls.kindCode.updateValueAndValidity()
  }

  ngOnInit(): void {
    this.routeParam.queryParams.subscribe(data => {
      if (data) {
        this.formGrouplottoConfig.controls.groupCode.setValue(data.groupCode)
        this.lottoGroupCode = data.groupCode;
        this.title = data.className;
        this.lottoClassCode = data.classCode;
        this.lottoConfigModel['lottoClassCode'] = data.classCode;

        this.setLottoClassCode(data.classCode)
        if (this.lottoGroupCode == null) {
          const row = this.formBuilder.group({
            level: 'lv.1',
            // groupMaxRisk: [null, [Validators.required, Validators.min(1)]],
            groupDtlCode: null,
            percentForLimit: [null, [Validators.required, Validators.min(1)]],

          });

          const row2 = this.formBuilder.group({

            kindCode: [null, [Validators.required, Validators.min(1)]],

          });
          this.listData.push(row);
          this.kindData.push(row2);
          this.updateView()
          this.lottoTypeList.push(
            { kindCode: null, }
          );

        } else if (this.lottoGroupCode != null) {

          this.getGroupRisk(this.lottoClassCode, this.lottoGroupCode);
        }

      }
    });
    console.log(this.formGrouplottoConfig.value);
    this.msdLottoKindListByClassCode(this.lottoClassCode)
  }

  checkSumPercent(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let number
      let sum = 0
      this.formGrouplottoConfig.controls.groupRiskList['controls'].forEach((element: FormGroup) => {
        number = 0
        number = Number(element.controls.percentForLimit.value)
        sum = sum + number

      });
      console.log(sum)
      return sum != 100 ? { 'toMuch': { value: control.value } } : null;
    }
  }

  greaterThan(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const group = control.parent;
      const fieldToCompare = group.get(field);
      const isLessThan = Number(fieldToCompare.value) <= Number(control.value);
      return isLessThan ? { 'moreThan': { value: control.value } } : null;
    }
  }

  greaterThanArray(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const group = control.parent;
      const fieldToCompare = this.formGrouplottoConfig.get(field)
      const isLessThan = Number(fieldToCompare.value) <= Number(control.value);
      return isLessThan ? { 'moreThan': { value: control.value } } : null;
    }
  }

  greaterThanInArray(field: string, index): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (index == 0) {

        if (this.formGrouplottoConfig.controls.groupRiskList['controls'].length > 1) {
          const fieldToCompare = this.formGrouplottoConfig.controls.groupRiskList['controls'][index + 1].get(field)
          const isLessThan = Number(fieldToCompare.value) <= Number(control.value);
          return isLessThan ? { 'moreThan2': { value: control.value } } : null;
        }
        else {
          const isLessThan = false
          return isLessThan ? { 'moreThan2': { value: control.value } } : null;
        }
      }
      else {

        const fieldToCompare = this.formGrouplottoConfig.controls.groupRiskList['controls'][index - 1].get(field)
        const isLessThan = Number(fieldToCompare.value) >= Number(control.value);
        return isLessThan ? { 'moreThan2': { value: control.value } } : null;
      }

    }
  }

  greaterThanInArray2(field: string, index): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      if (index == 0) {
        if (this.formGrouplottoConfig.controls.groupRiskList['controls'].length > 1) {
          const fieldToCompare = this.formGrouplottoConfig.controls.groupRiskList['controls'][index + 1].get(field)
          const isLessThan = Number(fieldToCompare.value) <= Number(control.value);
          return isLessThan ? { 'moreThan2': { value: control.value } } : null;
        }
        else {
          const isLessThan = false
          return isLessThan ? { 'moreThan2': { value: control.value } } : null;
        }
      }
      else {
        const fieldToCompare = this.formGrouplottoConfig.controls.groupRiskList['controls'][index - 1].get(field)
        console.log(fieldToCompare.value + '::++++22222222222222++++::' + control.value)
        const isLessThan = Number(fieldToCompare.value) >= Number(control.value);
        return isLessThan ? { 'moreThan2': { value: control.value } } : null;
      }


    }
  }

  checkIsEmpty(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      console.log(field)
      const group = control.parent;
      let checkIsEmpty = false
      if (!control.value || control.value == null) {
        checkIsEmpty = true
      }
      return checkIsEmpty ? { 'isEmpty': { value: control.value } } : null;
    }
  }

  //---------------------Add Row Risk---------------------------
  onClickAddRisk(event) {
    console.log(event);
    this.isDisable = true
    let i = 0
    if (this.listData.length === 0) {

      const row = this.formBuilder.group({
        level: 'lv.1',
        // groupMaxRisk: [null, [Validators.required, Validators.min(1)]],
        groupDtlCode: null,
        percentForLimit: [null, [Validators.required, Validators.min(1)]],

      });
      row.get('percentForLimit').setValidators([Validators.required, Validators.min(1), this.checkSumPercent()]);
      // row.get('groupMaxRisk').setValidators([Validators.required, Validators.min(1), this.greaterThanArray('groupMaxClose')]);
      i++;
      this.listData.push(row);

    }
    else {

      const row = this.formBuilder.group({
        level: 'lv.' + (this.listData.length + 1).toString(),
        // groupMaxRisk: [null, [Validators.required, Validators.min(1)]],
        groupDtlCode: null,
        percentForLimit: [null, [Validators.required, Validators.min(1)]],

      });
      row.get('percentForLimit').setValidators([Validators.required, Validators.min(1), this.checkSumPercent()]);
      // row.get('percentForLimit').setValidators([Validators.required, Validators.min(1), this.greaterThanArray('groupEarningsPercent')]);

      this.listData.push(row);
      i++;

    }
    this.updateView()
  }

  onClickEditRisk(event) {
    console.log(event);
  }

  //------------------Remove Row Risk------------------------
  removeLottoRisk(event, index) {
    let groupDtlCode = event.groupDtlCode;
    let data = this.dataSourceX.value[index];
    console.log(event, index)
    if (groupDtlCode != null) {
      const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'DELETE') {
          // deleteาร
          this.httpBeanService.doDelete('group-risk2/delete-group-max-risk/' + groupDtlCode).subscribe(res => {
            console.log(res);
            if (res.status === 'SUCCESS') {
              console.log("delete Risk!!!");
              this.lottoRiskList.splice(index, 1);
              this.formGrouplottoConfig.value.groupRiskList.splice(index, 1);
              this.dataSourceX.value.splice(index, 1);
              this.updateView();
            }
          });

        }
      });
    }
    else {
      this.lottoRiskList.splice(index, 1);
      this.formGrouplottoConfig.value.groupRiskList.splice(index, 1);
      this.dataSourceX.value.splice(index, 1);
      this.updateView();
    }
    this.onChange()

  }

  // ----------------------Add Row Type----------------------
  onClickAddType(event) {
    console.log(event);

    const row2 = this.formBuilder.group({
      kindCode: [null, [Validators.required]],

    });
    this.kindData.push(row2)
    this.updateView();
  }

  onClickEditType(event) {
    console.log(event);
  }

  // ----------------------Remove Type-----------------------
  removeLottoType(event, index) {

    let kindCode = event.kindCode;

    if (kindCode != null) {
      const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'DELETE') {
          // ------------------------------delete ---------------------------
          this.httpBeanService.doDelete('group-risk2/delete-group-risk/' + kindCode + '/' + this.lottoGroupCode + '/' + this.lottoClassCode).subscribe(res => {
            console.log(res);
            if (res.status === 'SUCCESS') {
              console.log("delete Risk!!!");
              this.formGrouplottoConfig.value.kindCode.splice(index, 1);
              this.dataSourceX2.value.splice(index, 1);
              this.updateView();
            }
          });

        }
      });
    }
    else {
      this.formGrouplottoConfig.value.kindCode.splice(index, 1);
      this.dataSourceX2.value.splice(index, 1);
      this.updateView();
    }

    this.onChange()

  }

  // ---------------------get MSD lotto kind List----------------------------
  msdLottoKindListByClassCode(classCode) {
    this.httpBeanService.doGet('msd-lotto-kind/get-by-class-code/' + classCode).subscribe(res => {
      res.data.forEach((element) => {
        this.msdLottoKindTypeList.push({
          name: element.msdLottoKindName,
          code: element.msdLottoKindCode,
        });
      });

    });
  }

  onSave() {

    console.log(this.formGrouplottoConfig)
    /** check form */
    const controls = this.formGrouplottoConfig.controls;
    this.isDisable = true
    if (this.formGrouplottoConfig.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    else {
      this.isDisable = false
    }


    if (!this.isDisable) {

      const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'SAVE') {

          this.kindCodeList = [];
          this.kindData.value.forEach((element) => {
            console.log(element)
            
            this.kindCodeList.push(
              element.kindCode
            );
          })
          this.formGrouplottoConfig.value['kindCode'] = [];
          console.log(this.formGrouplottoConfig.controls.kindCode['controls'])
          this.formGrouplottoConfig.value['kindCode'] = this.kindCodeList

          console.log(this.kindCodeList)
          console.log(this.formGrouplottoConfig)
          // this.httpBeanService.doPost('draft-group-risk/draft-add-group-risk', this.formGrouplottoConfig.value).subscribe(res => {
          this.httpBeanService.doPost('group-risk2/add-group-risk', this.formGrouplottoConfig.value).subscribe(res => {
            if (res.status === 'SUCCESS') {
              this.router.navigate(['lotto-settings/lotto-government/lotto-config/'],
                { queryParams: { classCode: this.lottoClassCode, groupCode: null, className: this.title } }
              );
            }
          });
        }
      });
    }
  }

  onCancel(): void {
    this._location.back();
  }

  setLottoClassCode(data) {
    this.formGrouplottoConfig.patchValue({
      lottoClassCode: data
    })
  }

  getGroupRisk(classCode, groupCode) {
    // /api/group-risk2/get-group-risk-by-code


    this.httpBeanService.doGet(`${URL.GROUP_RISK_GET}?lottoClassCode=${classCode}&lottoGroupCode=${groupCode}`).subscribe(res => {
      // this.formGrouplottoConfig = res.data;
      this.formGrouplottoConfig.patchValue({
        groupName: res.data.groupName,
        groupMaxClose: res.data.groupMaxClose,
        groupEarningsPercent: res.data.groupEarningsPercent,
        // groupEarningsPercentClose: res.data.groupEarningsPercentClose,
        lottoClassCode: res.data.lottoClassCode,

      })
      this.lottoConfigModel.kindCode = res.data.kindCode
      let i = 0
      if (res.data.groupRiskList.length != 0) {
        res.data.groupRiskList.forEach((element) => {
          const row = this.formBuilder.group({
            level: 'lv.' + (i + 1).toString(),
            // groupMaxRisk: [element.groupMaxRisk, [Validators.required, Validators.min(1)]],
            groupDtlCode: [element.groupDtlCode],
            percentForLimit: [element.percentForLimit, [Validators.required, Validators.min(1)]]

          });
          this.listData.push(row);
          i++;

        })

      }
      else if (res.data.groupRiskList.length == 0) {
        res.data.groupRiskList.forEach((element) => {
          const row = this.formBuilder.group({
            level: 'lv.' + (i + 1).toString(),
            // groupMaxRisk: [element.groupMaxRisk, [Validators.required, Validators.min(1)]],
            groupDtlCode: [element.groupDtlCode],
            percentForLimit: [element.percentForLimit, [Validators.required, Validators.min(1)]]

          });
          this.listData.push(row);
          i++;
        })

      }


      if (res.data.kindCode.length != 0) {
        res.data.kindCode.forEach((element) => {
          const row2 = this.formBuilder.group({
            kindCode: [element, [Validators.required]]
          });
          this.kindData.push(row2);

        })

      }
      else if (res.data.kindCode.length == 0) {
        res.data.kindCode.forEach((element) => {
          const row2 = this.formBuilder.group({
            kindCode: [element.kindCode, [Validators.required]]
          });
          this.kindData.push(row2);
        })

      }
      this.updateView();

      console.log(this.formGrouplottoConfig)
      this.lottoConfigModel.kindCode.forEach(kindCode => {
        this.getAllMsdLottoKindList(kindCode);
        this.lottoTypeList.push(
          { kindCode: kindCode, }
        );

      });
      console.log(this.lottoRiskList)

    });

  }

  updateView() {
    this.dataSourceX.next(this.listData.controls);
    this.dataSourceX2.next(this.kindData.controls)
    this.onChange()
  }

  getAllMsdLottoKindList(kindCode) {
    this.httpBeanService.doGet('msd-lotto-kind/get-all-msd').subscribe(res => {
      res.data.forEach(data => {
        if (data.msdLottoKindCode === kindCode) {
          this.msdLottoKindTypeList.push({
            name: data.msdLottoKindName,
            code: data.msdLottoKindCode,
          });
        }
      });
      // this.msdAllList = res.data;

    });
  }

  test() {
    console.log(this.formGrouplottoConfig)
    this.onChange()
  }

  sumPercent: any = 0
  onChange() {

    this.sumValuePercent()
    // this.formGrouplottoConfig.controls.groupEarningsPercentClose.updateValueAndValidity()
    this.formGrouplottoConfig.controls.groupRiskList['controls'].forEach((element: FormGroup) => {
      // element.controls.groupMaxRisk.updateValueAndValidity();
      element.controls.percentForLimit.updateValueAndValidity();
    });

    this.formGrouplottoConfig.controls.kindCode['controls'].forEach((element: FormGroup) => {
      element.controls.kindCode.updateValueAndValidity();
    });

  }

  sumValuePercent() {
    this.sumPercent = 0
    let number
    this.formGrouplottoConfig.controls.groupRiskList['controls'].forEach((element: FormGroup) => {
      number = 0
      number = Number(element.controls.percentForLimit.value)
      this.sumPercent = this.sumPercent + number
    });
  }


  checkCompareArray(index) {
    console.log(index)
    console.log(this.formGrouplottoConfig.controls.groupRiskList['controls'][0].get('percentForLimit'))
    // this.formGrouplottoConfig.controls.groupRiskList['controls'][index].controls.groupMaxRisk.setValidators([Validators.required, Validators.min(1), this.greaterThanArray('groupMaxClose'), this.greaterThanInArray2('groupMaxRisk', index)]);
    this.formGrouplottoConfig.controls.groupRiskList['controls'][index].controls.percentForLimit.setValidators([Validators.required, Validators.min(1), this.checkSumPercent()]);

    this.onChange()
  }

  getList(kindCode) {
    const listFilter = this.msdLottoKindTypeList.filter((element) => {
      const selected = this.kindData.value.filter((selected) => {
        return selected.kindCode === element.code;
      });
      return !selected.length || element.code === kindCode;
    });
    return listFilter;
  }



}