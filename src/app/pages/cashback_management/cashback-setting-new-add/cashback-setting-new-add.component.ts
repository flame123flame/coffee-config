import { catchError } from 'rxjs/operators';
import { MessageService } from './../../../service/message.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { count } from 'console';
import { BaseService } from 'src/app/service/BaseService.service';
import { CashbackSettingNewAddDialogComponent } from './cashback-setting-new-add-dialog/cashback-setting-new-add-dialog.component';
import * as moment from 'moment';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MatTable } from '@angular/material/table';
import { Location } from '@angular/common';

const URL = {
  PRODUCT_TYPE: "game-product-type",
  TAG_MANAGEMENT: "tag-management",
  GROUP_GAME: "game-group",
  GAME: "games",
  GROUP_LEVEL: "groupLevel/getAllGroupLevel",
  CASHBACK: "cashback",
  GET_GAME_BY_PRODUCT_TYPE: 'games/get-games-by-product-type',

}

@Component({
  selector: 'app-cashback-setting-new-add',
  templateUrl: './cashback-setting-new-add.component.html',
  styleUrls: ['./cashback-setting-new-add.component.scss']
})
export class CashbackSettingNewAddComponent implements OnInit {

  form: FormGroup;
  items: FormArray;

  vipList = [];
  tagList = [];
  disabled = false;

  code = null;
  id = null;
  constructor(private fb: FormBuilder,
    private httpSer: BaseService,
    private route: Router, private location: Location,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
    const code = this.routeParam.snapshot.queryParams.code;
    const id = this.routeParam.snapshot.queryParams.id;
    if (code) {
      this.code = code;
      this.disabled = true;
      this.getOne(code);
    } if (id) {
      this.id = id
    }
  }


  ngOnInit(): void {
    this.createForm();
    this.getVIPList();
    this.getTagList();
  }

  createForm() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null, Validators.required],
      periodStatus: [2, Validators.required],
      isAutoCashback: [true, Validators.required],
      status: [true, Validators.required],
      vipGroupCode: [[], Validators.required],
      cashbackConditionMultiplier: [null, Validators.required],
      tagCode: [[]],
    });
  }

  setForm(data) {
    this.form.patchValue({
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      periodStatus: data.periodStatus,
      isAutoCashback: data.isAutoCashback,
      status: data.status,
      vipGroupCode: data.vipGroupCode,
      cashbackConditionMultiplier: data.cashbackConditionMultiplier,
      tagCode: data.tagCode,
    })
  }

  getOne(code) {
    this.httpSer.doGet(`${URL.CASHBACK}/get-by-id/${code}`).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.setForm(res.data);
        this.initTable(res.data.cashbackConditionResList);
      }
    });
  }

  getVIPList() {
    this.httpSer.doGet(URL.GROUP_LEVEL).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.vipList = data.data;
      }
    });
  }

  getTagList() {
    this.httpSer.doGet(URL.TAG_MANAGEMENT).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.tagList = data.data;
      }
    });
  }

  createItem(id = null, number = null, kind = null): FormGroup {
    return this.fb.group({
      id: [id],
      lottoNumber: [number, Validators.required],
      lottoKind: [kind, Validators.required],
    });
  }

  addItem(id = null, number = null, kind = null): void {
    this.items = this.form.get('lottoGroupNumberChildList') as FormArray;
    this.items.push(this.createItem(id, number, kind));
  }

  setValidate(index, code) {
    // console.log(this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]);
    // this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].clearValidators();
    // this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].clearAsyncValidators();
    // this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].setValidators([Validators.required,Validators.minLength(this.getMin(code)),Validators.maxLength(this.getMin(code)),Validators.pattern(/^[0-9]\d*$/)])
    // this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].updateValueAndValidity();
  }

  depositLevelSource: any[] = [
    { moreThanAmount: null, cashbackPercent: null, maxCashbackAmount: null },
  ];

  add() {
    if (this.depositLevelSource.length >= 10) {
      return;
    }
    // get last level
    this.depositLevelSource.push({
      moreThanAmount: null,
      cashbackPercent: null,
      maxCashbackAmount: null,
    });
    this.table.renderRows();
  }

  reset() {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.depositLevelSource = [
        { moreThanAmount: null, cashbackPercent: null, maxCashbackAmount: null },
      ];
    })

  }

  del(index: number) {
    this.depositLevelSource.splice(index, 1);
    this.table.renderRows();
  }

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  displayedColumns: string[] = [
    'level',
    'moreThanAmount',
    'cashbackPercent',
    'maxCashbackAmount',
    'remove',
  ];

  getDepositArray() {
    let reqData: any[] = [];
    this.depositLevelSource.forEach((ele, index) => {
      let reqItem: any = {
        level: index + 1,
        moreThanAmount: ele.moreThanAmount,
        cashbackPercent: ele.cashbackPercent,
        maxCashbackAmount: ele.maxCashbackAmount,
      };
      reqData.push(reqItem);
    });
    return reqData;
  }


  initTable(data: any[]) {

    this.depositLevelSource = data.map(element => {
      return {
        moreThanAmount: element.moreThanAmount,
        cashbackPercent: element.cashbackPercent,
        maxCashbackAmount: element.maxCashbackAmount
      }
    });
    this.table.renderRows();
  }

  save() {
    let data = this.form.value
    data.cashbackConditionList = this.getDepositArray();
    let msg = MessageService.DIALOGMSGCONFIRM.SAVE;
    if (this.code) {
      msg = MessageService.DIALOGMSGCONFIRM.EDIT
    }
    data.startDate = moment(this.form.controls.startDate.value).startOf('days').toDate();
    data.endDate = moment(this.form.controls.endDate.value).startOf('days').minute(15).toDate();
    console.log(this.form)
    console.log(this.validateEmtypTable())
    console.log(this.validateTable())
    if (this.form.invalid || !this.validateEmtypTable()) {
      this.form.markAllAsTouched();
      DialogSweetAlertService.opentModalSweetAlertError('', 'ข้อมูลไม่ครบถ้วน');
      return;
    }
    if (!this.validateTable()) {
      DialogSweetAlertService.opentModalSweetAlertError('', 'ระดับต้องเรียงจากมากไปน้อย');
      return;
    }
    DialogSweetAlertService.opentModalSweetAlertConfirm('', msg, () => {
      if (this.code) {
        this.httpSer.doPut(`${URL.CASHBACK}/${this.id}`, data).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
            this.goBack()
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      } else {
        this.httpSer.doPost(URL.CASHBACK, data).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
            this.goBack()
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      }
    })
  }

  goBack() {
    this.location.back();
  }

  validateTable() {
    for (let index = 0; index < this.depositLevelSource.length; index++) {
      if (index != 0) {
        console.log(this.depositLevelSource[index].moreThanAmount, this.depositLevelSource[index - 1].moreThanAmount)
        if (this.depositLevelSource[index].moreThanAmount >= this.depositLevelSource[index - 1].moreThanAmount)
          return false;
      }
    }
    return true
  }

  validateEmtypTable() {
    return this.depositLevelSource.every(element => element.moreThanAmount != null &&
      element.cashbackPercent != null &&
      element.maxCashbackAmount != null)
  }

  myFilter = (d: Date): boolean => {
    switch (this.form.controls.periodStatus.value) {
      case 1:
        return true;
        break;
      case 2:
        const day = d.getDay();
        return day === 1;
        break;
      case 3:
        const date = d.getDate();
        return date === 1;
        break;
    }
  }
}
