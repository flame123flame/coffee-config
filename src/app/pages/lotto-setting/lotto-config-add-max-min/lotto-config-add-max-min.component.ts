import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { LottoConfigDialogConfirmComponent } from '../lotto-config/lotto-config-dialog-confirm/lotto-config-dialog-confirm.component';

const URL = {

  MAXMIN_GET: 'group-risk2/get-group-risk-max-min-by-code',
  MAXMIN_ADD: 'group-risk2/add-group-risk-max-min'

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
  selector: 'app-lotto-config-add-max-min',
  templateUrl: './lotto-config-add-max-min.component.html',
  styleUrls: ['./lotto-config-add-max-min.component.scss']
})
export class LottoConfigAddMaxMinComponent implements OnInit {

  vipGroupList: VipGroupList[] = [];

  displayedColumns: any = [
    'vipCode',
    'minimumTrans',
    'maximumTrans',
    'maximumUsername',
    'action',
  ];

  lottoMaxMinList: MaxMinList[] = [];
  title = '';
  lottoClassCode: any;
  msdLottoKindCode: any;
  msdLottoKindName = '';
  lottoGroupCode = '';
  lottoConfigMaxMinModel = {
    lottoName: this.title,
    lottoMaxMinList: this.lottoMaxMinList,
  };

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
    private _location: Location,
  ) {

  }

  ngOnInit(): void {
    this.routeParam.queryParams.subscribe(data => {
      if (data) {
        this.title = data.className;
        this.lottoClassCode = data.classCode;
        this.lottoGroupCode = data.groupCode;
        this.msdLottoKindCode = data.msdLottoKindCode;
        this.msdLottoKindName = data.msdLottoKindName;
        // this.groupLevelList();
        this.getMinMax(this.lottoClassCode, this.msdLottoKindCode, this.lottoGroupCode);
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
      minimumTrans: [null, [Validators.required, Validators.min(1)]],
      maximumTrans: [null, [Validators.required, Validators.min(1)]],
      maximumUsername: [null, [Validators.required, Validators.min(1)]],
      vipCode: [null, Validators.required],
      groupMaxMinMapCode: null,
      lottoClassCode: [this.lottoClassCode],
      msdLottoKindCode: [this.msdLottoKindCode],
      lottoGroupCode: [this.lottoGroupCode],

    });
    row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
    row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
    this.rowsData.push(row);

    this.updateView();
  }
  dropRow(index) {
    let data = this.dataSourceX.value[index];
    let kindCode = data.value.msdLottoKindCode;
    let groupMaxMinMapCode = data.value.groupMaxMinMapCode;
    let lottoGroupCode = this.lottoGroupCode;

    if (kindCode != null) {
      const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'DELETE' }, width: '100' });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'DELETE') {
          // delete
          this.httpBeanService.doDelete('group-risk2/delete-group-max-min/' + kindCode + '/' + lottoGroupCode + '/' + groupMaxMinMapCode).subscribe(res => {
            console.log(res);
            if (res.status === 'SUCCESS') {
              console.log("delete Risk!!!");

              this.formGroup.value.data.splice(index, 1);
              this.dataSourceX.value.splice(index, 1);
              this.formGroup.controls.data.updateValueAndValidity();
              // this.rowsData.removeAt(index);
              // this.rowsData.updateValueAndValidity();
              this.updateView();
            }
          });
        }
      });
    }
    else {

      this.formGroup.value.data.splice(index, 1);
      this.dataSourceX.value.splice(index, 1);
      this.formGroup.controls.data.updateValueAndValidity();
      // this.rowsData.removeAt(index);
      // this.rowsData.updateValueAndValidity();
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

  test() {
    console.log(this.formGroup)
  }
  onSave() {
    this.lottoConfigMaxMinModel.lottoMaxMinList = this.formGroup.value.data;
    this.lottoConfigMaxMinModel.lottoName = this.title;
    console.log(this.formGroup);
    console.log(this.lottoConfigMaxMinModel);
    /** check form */

    const controls = this.formGroup.controls;
    if (this.formGroup.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'SAVE') {
        // Save Max/Min Api
        console.log(this.lottoConfigMaxMinModel);
        this.httpBeanService.doPost(URL.MAXMIN_ADD, this.lottoConfigMaxMinModel).subscribe(res => {
          console.log(res);
          if (res.status === 'SUCCESS') {
            this.router.navigate(['lotto-settings/lotto-government/lotto-config/'],
              { queryParams: { classCode: this.lottoClassCode, groupCode: null, className: this.title } }
            );
          }
        });
      }
    });
  }

  onCancel(): void {
    console.log(this.lottoClassCode);
    console.log(this.rowsData);
    console.log(this.formGroup);
    this._location.back();
  }

  onChange(index) {

    console.log(this.formGroup.controls.data['controls']);

    this.formGroup.controls.data['controls'].forEach((element: FormGroup) => {
      element.controls.minimumTrans.updateValueAndValidity();
      element.controls.maximumTrans.updateValueAndValidity();
      element.controls.maximumUsername.updateValueAndValidity();
      element.controls.minimumTrans.markAllAsTouched();
      element.controls.maximumTrans.markAllAsTouched();
      element.controls.maximumUsername.markAllAsTouched();
    });
  }

  getMinMax(classCode, kindCode, groupCode) {

    this.httpBeanService.doGet(`${URL.MAXMIN_GET}?lottoClassCode=${classCode}&msdLottoKindCode=${kindCode}&lottoGroupCode=${groupCode}`).subscribe(res => {
      console.log(res);
      if (res.data.length != 0) {
        res.data.forEach((element, i) => {
          const row = this.formBuilder.group({
            minimumTrans: [element.minimumTrans, [Validators.required, Validators.min(1),]],
            maximumTrans: [element.maximumTrans, [Validators.required, Validators.min(1),]],
            maximumUsername: [element.maximumUsername, [Validators.required,]],
            vipCode: [element.vipCode, Validators.required],
            groupMaxMinMapCode: [element.groupMaxMinMapCode],
            lottoClassCode: [element.lottoClassCode, Validators.required],
            msdLottoKindCode: [element.msdLottoKindCode, Validators.required],
            lottoGroupCode: [this.lottoGroupCode, Validators.required],
          });
          row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
          row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
          this.rowsData.push(row);
        });
      }
      else if (res.data.length == 0) {

        const row = this.formBuilder.group({
          minimumTrans: [null, [Validators.required, Validators.min(1),]],
          maximumTrans: [null, [Validators.required,]],
          maximumUsername: [null, [Validators.required]],
          vipCode: ['DEFAULT', Validators.required],
          groupMaxMinMapCode: [null,],
          lottoClassCode: [this.lottoClassCode, Validators.required],
          msdLottoKindCode: [this.msdLottoKindCode, Validators.required],
          lottoGroupCode: [this.lottoGroupCode, Validators.required],
        });
        row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
        row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
        this.rowsData.push(row);
      }
      console.log(this.rowsData);
      console.log(this.rowsData.controls);
      this.groupLevelList();
      this.updateView();
    });
  }

  greaterThan(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      const group = control.parent;
      const fieldToCompare = group.get(field);
      const isLessThan = Number(fieldToCompare.value) > Number(control.value);
      return isLessThan ? { 'lessThan': { value: control.value } } : null;
    }
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
