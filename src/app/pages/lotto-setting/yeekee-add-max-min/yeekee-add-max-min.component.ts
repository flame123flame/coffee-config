import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { LottoConstants } from '../lotto-constants/lotto-constants';

const URL = {
  CLOSE_NUMBER: 'close-number/get-close-number',
  CHANG_STATUS: 'close-number',
  CLOSE_DELETE: 'close-number/delete-close-number',
  GET_MSD: 'msd-lotto-kind/get-all-msd',
  MAXMIN_GET: 'add-yeekee/get-max-min-yeekee',
  DELETE_MAXMIN_BY_CODE: 'add-yeekee/delete-max-min-yeekee-by-id',
  MAXMIN_ADD: 'group-risk2/add-group-risk-max-min',
  SAVE_MAXMIN: 'add-yeekee/save-lotto-yeekee-max-min'
};

export class VipGroupList {
  code: string;
  name: string; //list?
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

@Component({
  selector: 'app-yeekee-add-max-min',
  templateUrl: './yeekee-add-max-min.component.html',
  styleUrls: ['./yeekee-add-max-min.component.scss']
})
export class YeekeeAddMaxMinComponent implements OnInit {


  vipGroupList: VipGroupList[] = [];

  displayedColumns: any = [
    'vipCode',
    'minimumPerTran',
    'maximumPerTran',
    'maximumPerUser',
    'action',
  ];

  lottoMaxMinList: MaxMinList[] = [];

  actionSetting: ActionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: true,
    hideDetail: false,
  });
  className: string;

  msdList = [];
  msdDataList = {};
  NODATA_MESSAGE = 'NO DATA';

  title = '';
  lottoClassCode: any;
  msdLottoKindCode: any;
  msdLottoKindName = '';
  lottoGroupCode = '';

  dataArray = [];
  dataSource1 = new BehaviorSubject<AbstractControl[]>([]);
  dataSource2 = new BehaviorSubject<AbstractControl[]>([]);
  dataSource3 = new BehaviorSubject<AbstractControl[]>([]);
  dataSource4 = new BehaviorSubject<AbstractControl[]>([]);
  dataSource5 = new BehaviorSubject<AbstractControl[]>([]);
  dataSource6 = new BehaviorSubject<AbstractControl[]>([]);
  digit3top: FormArray = this.formBuilder.array([]);
  digit3swap: FormArray = this.formBuilder.array([]);
  digit2top: FormArray = this.formBuilder.array([]);
  digit2bot: FormArray = this.formBuilder.array([]);
  digit1top: FormArray = this.formBuilder.array([]);
  digit1bot: FormArray = this.formBuilder.array([]);
  formAddMaxmin: FormGroup = this.formBuilder.group({
    digit3top: this.digit3top,
    digit3swap: this.digit3swap,
    digit2top: this.digit2top,
    digit2bot: this.digit2bot,
    digit1top: this.digit1top,
    digit1bot: this.digit1bot
  })

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private httpBaseService: BaseService,
    private formBuilder: FormBuilder,
  ) {
    routeParam.queryParams.subscribe(param => {
      this.lottoClassCode = param.classCode;
      this.className = param.className;
      this.getMSD();
    });
  }

  ngOnInit(): void {
    this.groupLevelList();
    this.getPrizeByCode(this.lottoClassCode);
  }

  greaterThan(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      const group = control.parent;
      const fieldToCompare = group.get(field);
      const isLessThan = Number(fieldToCompare.value) > Number(control.value);
      return isLessThan ? { 'lessThan': { value: control.value } } : null;
    }
  }

  addRow(msdCode) {
    if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_TOP) {
      const row3top = this.formBuilder.group({

        minimumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumUsername: [null, [Validators.required, Validators.min(1)]],
        vipCode: [null, Validators.required],
        groupMaxMinMapCode: null,
        lottoClassCode: [this.lottoClassCode],
        msdLottoKindCode: [LottoConstants.MSD_LOTTO_3DIGIT_TOP],

      });
      row3top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
      row3top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
      this.digit3top.push(row3top);
      this.updateView();
    }
    if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED) {
      const row3swap = this.formBuilder.group({

        minimumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumUsername: [null, [Validators.required, Validators.min(1)]],
        vipCode: [null, Validators.required],
        groupMaxMinMapCode: null,
        lottoClassCode: [this.lottoClassCode],
        msdLottoKindCode: [LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED],

      });
      row3swap.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
      row3swap.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
      this.digit3swap.push(row3swap);
      this.updateView();
    }
    if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_TOP) {
      const row2top = this.formBuilder.group({

        minimumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumUsername: [null, [Validators.required, Validators.min(1)]],
        vipCode: [null, Validators.required],
        groupMaxMinMapCode: null,
        lottoClassCode: [this.lottoClassCode],
        msdLottoKindCode: [LottoConstants.MSD_LOTTO_2DIGIT_TOP],

      });
      row2top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
      row2top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
      this.digit2top.push(row2top);
      this.updateView();
    }
    if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_BOT) {
      const row2bot = this.formBuilder.group({

        minimumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumUsername: [null, [Validators.required, Validators.min(1)]],
        vipCode: [null, Validators.required],
        groupMaxMinMapCode: null,
        lottoClassCode: [this.lottoClassCode],
        msdLottoKindCode: [LottoConstants.MSD_LOTTO_2DIGIT_BOT],

      });
      row2bot.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
      row2bot.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
      this.digit2bot.push(row2bot);
      this.updateView();
    }
    if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_TOP) {
      const row1top = this.formBuilder.group({

        minimumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumUsername: [null, [Validators.required, Validators.min(1)]],
        vipCode: [null, Validators.required],
        groupMaxMinMapCode: null,
        lottoClassCode: [this.lottoClassCode],
        msdLottoKindCode: [LottoConstants.MSD_LOTTO_1DIGIT_TOP],

      });
      row1top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
      row1top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
      this.digit1top.push(row1top);
      this.updateView();
    }
    if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_BOT) {
      const row1bot = this.formBuilder.group({

        minimumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumTrans: [null, [Validators.required, Validators.min(1)]],
        maximumUsername: [null, [Validators.required, Validators.min(1)]],
        vipCode: [null, Validators.required],
        groupMaxMinMapCode: null,
        lottoClassCode: [this.lottoClassCode],
        msdLottoKindCode: [LottoConstants.MSD_LOTTO_1DIGIT_BOT],

      });
      row1bot.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
      row1bot.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
      this.digit1bot.push(row1bot);
      this.updateView();
    }
  }

  initPage() {

  }

  getMSD() {
    this.httpBeanService.doGet(`${URL.GET_MSD}`).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.msdList = data.data;
      }
    });
  }

  getPrizeByCode(classCode) {

    this.httpBeanService.doGet(`${URL.MAXMIN_GET}/${classCode}`).subscribe(res => {

      if (res.status == "SUCCESS") {
        if (res.data.digit3top.length != 0) {
          res.data.digit3top.forEach(element => {
            const row = this.formBuilder.group({
              minimumTrans: [element.minimumPerTrans, Validators.required],
              maximumTrans: [element.maximumPerTrans, Validators.required],
              maximumUsername: [element.maximumPerUser, Validators.required],
              groupMaxMinMapCode: [element.groupMaxMinMapCode, Validators.required],
              groupMaxMinMapId: [element.groupMaxMinMapId, Validators.required],
              lottoGroupCode: [element.vipCode, Validators.required],
              vipCode: [element.vipCode, Validators.required],
              lottoClassCode: [element.lottoClassCode, Validators.required],
              msdLottoKindCode: [element.msdLottoKindCode, Validators.required],

            });
            row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
            row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
            this.digit3top.push(row);
          });
        }
        else {
          const row3top = this.formBuilder.group({
            minimumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumUsername: [null, [Validators.required, Validators.min(1)]],
            groupMaxMinMapCode: null,
            msdLottoKindCode: [LottoConstants.MSD_LOTTO_3DIGIT_TOP],
            vipCode: ['DEFAULT', Validators.required],
            lottoClassCode: [this.lottoClassCode, Validators.required],

          });
          row3top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
          row3top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
          this.digit3top.push(row3top);
        }

        if (res.data.digit3swap.length != 0) {
          res.data.digit3swap.forEach(element => {
            const row = this.formBuilder.group({
              minimumTrans: [element.minimumPerTrans, Validators.required],
              maximumTrans: [element.maximumPerTrans, Validators.required],
              maximumUsername: [element.maximumPerUser, Validators.required],
              groupMaxMinMapCode: [element.groupMaxMinMapCode, Validators.required],
              groupMaxMinMapId: [element.groupMaxMinMapId, Validators.required],
              lottoGroupCode: [element.vipCode, Validators.required],
              vipCode: [element.vipCode, Validators.required],
              lottoClassCode: [element.lottoClassCode, Validators.required],
              msdLottoKindCode: [element.msdLottoKindCode, Validators.required],

            });
            row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
            row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
            this.digit3swap.push(row);
          });
        }
        else {
          const row3swap = this.formBuilder.group({
            minimumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumUsername: [null, [Validators.required, Validators.min(1)]],
            groupMaxMinMapCode: null,
            msdLottoKindCode: [LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED],
            vipCode: ['DEFAULT', Validators.required],
            lottoClassCode: [this.lottoClassCode, Validators.required],

          });
          row3swap.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
          row3swap.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
          this.digit3swap.push(row3swap);
        }


        if (res.data.digit2top.length != 0) {
          res.data.digit2top.forEach(element => {
            const row = this.formBuilder.group({
              minimumTrans: [element.minimumPerTrans, Validators.required],
              maximumTrans: [element.maximumPerTrans, Validators.required],
              maximumUsername: [element.maximumPerUser, Validators.required],
              groupMaxMinMapCode: [element.groupMaxMinMapCode, Validators.required],
              groupMaxMinMapId: [element.groupMaxMinMapId, Validators.required],
              lottoGroupCode: [element.vipCode, Validators.required],
              vipCode: [element.vipCode, Validators.required],
              lottoClassCode: [element.lottoClassCode, Validators.required],
              msdLottoKindCode: [element.msdLottoKindCode, Validators.required],

            });
            row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
            row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
            this.digit2top.push(row);
          });
        }
        else {
          const row2top = this.formBuilder.group({
            minimumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumUsername: [null, [Validators.required, Validators.min(1)]],
            groupMaxMinMapCode: null,
            msdLottoKindCode: [LottoConstants.MSD_LOTTO_2DIGIT_TOP],
            vipCode: ['DEFAULT', Validators.required],
            lottoClassCode: [this.lottoClassCode, Validators.required],

          });
          row2top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
          row2top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
          this.digit2top.push(row2top);
        }

        if (res.data.digit2bot.length != 0) {
          res.data.digit2bot.forEach(element => {
            const row = this.formBuilder.group({
              minimumTrans: [element.minimumPerTrans, Validators.required],
              maximumTrans: [element.maximumPerTrans, Validators.required],
              maximumUsername: [element.maximumPerUser, Validators.required],
              groupMaxMinMapCode: [element.groupMaxMinMapCode, Validators.required],
              groupMaxMinMapId: [element.groupMaxMinMapId, Validators.required],
              lottoGroupCode: [element.vipCode, Validators.required],
              vipCode: [element.vipCode, Validators.required],
              lottoClassCode: [element.lottoClassCode, Validators.required],
              msdLottoKindCode: [element.msdLottoKindCode, Validators.required],

            });
            row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
            row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
            this.digit2bot.push(row);
          });
        }
        else {
          const row2bot = this.formBuilder.group({
            minimumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumUsername: [null, [Validators.required, Validators.min(1)]],
            groupMaxMinMapCode: null,
            msdLottoKindCode: [LottoConstants.MSD_LOTTO_2DIGIT_BOT],
            vipCode: ['DEFAULT', Validators.required],
            lottoClassCode: [this.lottoClassCode, Validators.required],

          });
          row2bot.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
          row2bot.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
          this.digit2bot.push(row2bot);
        }

        if (res.data.digit1top.length != 0) {
          res.data.digit1top.forEach(element => {
            const row = this.formBuilder.group({
              minimumTrans: [element.minimumPerTrans, Validators.required],
              maximumTrans: [element.maximumPerTrans, Validators.required],
              maximumUsername: [element.maximumPerUser, Validators.required],
              groupMaxMinMapCode: [element.groupMaxMinMapCode, Validators.required],
              groupMaxMinMapId: [element.groupMaxMinMapId, Validators.required],
              lottoGroupCode: [element.vipCode, Validators.required],
              vipCode: [element.vipCode, Validators.required],
              lottoClassCode: [element.lottoClassCode, Validators.required],
              msdLottoKindCode: [element.msdLottoKindCode, Validators.required],

            });
            row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
            row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
            this.digit1top.push(row);
          });
        }
        else {
          const row1top = this.formBuilder.group({
            minimumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumUsername: [null, [Validators.required, Validators.min(1)]],
            groupMaxMinMapCode: null,
            msdLottoKindCode: [LottoConstants.MSD_LOTTO_1DIGIT_TOP],
            vipCode: ['DEFAULT', Validators.required],
            lottoClassCode: [this.lottoClassCode, Validators.required],

          });
          row1top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
          row1top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
          this.digit1top.push(row1top);
        }

        if (res.data.digit1bot.length != 0) {
          res.data.digit1bot.forEach(element => {
            const row = this.formBuilder.group({
              minimumTrans: [element.minimumPerTrans, Validators.required],
              maximumTrans: [element.maximumPerTrans, Validators.required],
              maximumUsername: [element.maximumPerUser, Validators.required],
              groupMaxMinMapCode: [element.groupMaxMinMapCode, Validators.required],
              groupMaxMinMapId: [element.groupMaxMinMapId, Validators.required],
              lottoGroupCode: [element.vipCode, Validators.required],
              vipCode: [element.vipCode, Validators.required],
              lottoClassCode: [element.lottoClassCode, Validators.required],
              msdLottoKindCode: [element.msdLottoKindCode, Validators.required],

            });
            row.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
            row.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
            this.digit1bot.push(row);
          });
        }
        else {
          const row1bot = this.formBuilder.group({
            minimumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumTrans: [null, [Validators.required, Validators.min(1)]],
            maximumUsername: [null, [Validators.required, Validators.min(1)]],
            groupMaxMinMapCode: null,
            msdLottoKindCode: [LottoConstants.MSD_LOTTO_1DIGIT_BOT],
            vipCode: ['DEFAULT', Validators.required],
            lottoClassCode: [this.lottoClassCode, Validators.required],

          });
          row1bot.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
          row1bot.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
          this.digit1bot.push(row1bot);
        }








        this.updateView()
      }
      else if (res.data.length == 0) {

        const row3top = this.formBuilder.group({
          minimumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumUsername: [null, [Validators.required, Validators.min(1)]],
          groupMaxMinMapCode: null,
          msdLottoKindCode: [LottoConstants.MSD_LOTTO_3DIGIT_TOP],
          vipCode: ['DEFAULT', Validators.required],
          lottoClassCode: [this.lottoClassCode, Validators.required],

        });
        row3top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
        row3top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
        this.digit3top.push(row3top);

        const row3swap = this.formBuilder.group({
          minimumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumUsername: [null, [Validators.required, Validators.min(1)]],
          groupMaxMinMapCode: null,
          msdLottoKindCode: [LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED],
          vipCode: ['DEFAULT', Validators.required],
          lottoClassCode: [this.lottoClassCode, Validators.required],

        });
        row3swap.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
        row3swap.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
        this.digit3swap.push(row3swap);

        const row2top = this.formBuilder.group({
          minimumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumUsername: [null, [Validators.required, Validators.min(1)]],
          groupMaxMinMapCode: null,
          msdLottoKindCode: [LottoConstants.MSD_LOTTO_2DIGIT_TOP],
          vipCode: ['DEFAULT', Validators.required],
          lottoClassCode: [this.lottoClassCode, Validators.required],

        });
        row2top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
        row2top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
        this.digit2top.push(row2top);

        const row2bot = this.formBuilder.group({
          minimumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumUsername: [null, [Validators.required, Validators.min(1)]],
          groupMaxMinMapCode: null,
          msdLottoKindCode: [LottoConstants.MSD_LOTTO_2DIGIT_BOT],
          vipCode: ['DEFAULT', Validators.required],
          lottoClassCode: [this.lottoClassCode, Validators.required],

        });
        row2bot.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
        row2bot.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
        this.digit2bot.push(row2bot);

        const row1top = this.formBuilder.group({
          minimumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumUsername: [null, [Validators.required, Validators.min(1)]],
          groupMaxMinMapCode: null,
          msdLottoKindCode: [LottoConstants.MSD_LOTTO_1DIGIT_TOP],
          vipCode: ['DEFAULT', Validators.required],
          lottoClassCode: [this.lottoClassCode, Validators.required],

        });
        row1top.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
        row1top.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
        this.digit1top.push(row1top);

        const row1bot = this.formBuilder.group({
          minimumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumTrans: [null, [Validators.required, Validators.min(1)]],
          maximumUsername: [null, [Validators.required, Validators.min(1)]],
          groupMaxMinMapCode: null,
          msdLottoKindCode: [LottoConstants.MSD_LOTTO_1DIGIT_BOT],
          vipCode: ['DEFAULT', Validators.required],
          lottoClassCode: [this.lottoClassCode, Validators.required],

        });
        row1bot.get('maximumTrans').setValidators([Validators.required, Validators.min(1), this.greaterThan('minimumTrans')]);
        row1bot.get('maximumUsername').setValidators([Validators.required, Validators.min(1), this.greaterThan('maximumTrans'), this.greaterThan('minimumTrans')]);
        this.digit1bot.push(row1bot);

        this.updateView();

      }
    })
    this.updateView();
  }

  dropRow(element, index) {
    let msdCode = element.value.msdLottoKindCode
    console.log(index)
    console.log(element)
    console.log(msdCode)
    // let data = this.dataSource1.value[index];
    // let kindCode = data.value.msdLottoKindCode;
    // let groupMaxMinMapCode = data.value.groupMaxMinMapCode;
    // let lottoGroupCode = this.lottoGroupCode;

    if (element.value.groupMaxMinMapId != null) {
      // delete

      DialogSweetAlertService.opentModalSweetAlertConfirm('ยืนยันการลบข้อมูล', 'คุณต้องการยืนยันลบข้อมูลนี้หรือไม่', () => {
        this.httpBeanService.doDelete(`${URL.DELETE_MAXMIN_BY_CODE}/${element.value.groupMaxMinMapId}`).subscribe(res => {
          if (res.status == "SUCCESS") {
            if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_TOP) {
              this.formAddMaxmin.value.digit3top.splice(index, 1);
              this.dataSource1.value.splice(index, 1);
              this.formAddMaxmin.controls.digit3top.updateValueAndValidity();
              this.updateView();
            }
            if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED) {
              this.formAddMaxmin.value.digit3swap.splice(index, 1);
              this.dataSource2.value.splice(index, 1);
              this.formAddMaxmin.controls.digit3swap.updateValueAndValidity();
              this.updateView();
            }
            if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_TOP) {
              this.formAddMaxmin.value.digit2top.splice(index, 1);
              this.dataSource3.value.splice(index, 1);
              this.formAddMaxmin.controls.digit2top.updateValueAndValidity();
              this.updateView();
            }
            if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_BOT) {
              this.formAddMaxmin.value.digit2bot.splice(index, 1);
              this.dataSource4.value.splice(index, 1);
              this.formAddMaxmin.controls.digit2bot.updateValueAndValidity();
              this.updateView();
            }
            if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_TOP) {
              this.formAddMaxmin.value.digit1top.splice(index, 1);
              this.dataSource5.value.splice(index, 1);
              this.formAddMaxmin.controls.digit1top.updateValueAndValidity();
              this.updateView();
            }
            if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_BOT) {
              this.formAddMaxmin.value.digit1bot.splice(index, 1);
              this.dataSource6.value.splice(index, 1);
              this.formAddMaxmin.controls.digit1bot.updateValueAndValidity();
              this.updateView();
            }
          }
        });
      });

    }
    else {
      if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_TOP) {
        this.formAddMaxmin.value.digit3top.splice(index, 1);
        this.dataSource1.value.splice(index, 1);
        this.formAddMaxmin.controls.digit3top.updateValueAndValidity();
        this.updateView();
      }
      if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED) {
        this.formAddMaxmin.value.digit3swap.splice(index, 1);
        this.dataSource2.value.splice(index, 1);
        this.formAddMaxmin.controls.digit3swap.updateValueAndValidity();
        this.updateView();
      }
      if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_TOP) {
        this.formAddMaxmin.value.digit2top.splice(index, 1);
        this.dataSource3.value.splice(index, 1);
        this.formAddMaxmin.controls.digit2top.updateValueAndValidity();
        this.updateView();
      }
      if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_BOT) {
        this.formAddMaxmin.value.digit2bot.splice(index, 1);
        this.dataSource4.value.splice(index, 1);
        this.formAddMaxmin.controls.digit2bot.updateValueAndValidity();
        this.updateView();
      }
      if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_TOP) {
        this.formAddMaxmin.value.digit1top.splice(index, 1);
        this.dataSource5.value.splice(index, 1);
        this.formAddMaxmin.controls.digit1top.updateValueAndValidity();
        this.updateView();
      }
      if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_BOT) {
        this.formAddMaxmin.value.digit1bot.splice(index, 1);
        this.dataSource6.value.splice(index, 1);
        this.formAddMaxmin.controls.digit1bot.updateValueAndValidity();
        this.updateView();
      }

    }

  }

  updateView() {
    this.dataSource1.next(this.digit3top.controls);
    this.dataSource2.next(this.digit3swap.controls);
    this.dataSource3.next(this.digit2top.controls)
    this.dataSource4.next(this.digit2bot.controls)
    this.dataSource5.next(this.digit1top.controls)
    this.dataSource6.next(this.digit1bot.controls)
  }

  getList(msdCode, vipCode) {
    if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_TOP) {
      const listFilter = this.vipGroupList.filter((element) => {
        const selected = this.formAddMaxmin.value.digit3top.filter((selected) => {
          return selected.vipCode === element.code;
        });
        return !selected.length || element.code === vipCode;
      });
      return listFilter;
    }
    if (msdCode == LottoConstants.MSD_LOTTO_3DIGIT_SWAPPED) {
      const listFilter = this.vipGroupList.filter((element) => {
        const selected = this.formAddMaxmin.value.digit3swap.filter((selected) => {
          return selected.vipCode === element.code;
        });
        return !selected.length || element.code === vipCode;
      });
      return listFilter;
    }
    if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_TOP) {
      const listFilter = this.vipGroupList.filter((element) => {
        const selected = this.formAddMaxmin.value.digit2top.filter((selected) => {
          return selected.vipCode === element.code;
        });
        return !selected.length || element.code === vipCode;
      });
      return listFilter;
    }
    if (msdCode == LottoConstants.MSD_LOTTO_2DIGIT_BOT) {
      const listFilter = this.vipGroupList.filter((element) => {
        const selected = this.formAddMaxmin.value.digit2bot.filter((selected) => {
          return selected.vipCode === element.code;
        });
        return !selected.length || element.code === vipCode;
      });
      return listFilter;
    }
    if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_TOP) {
      const listFilter = this.vipGroupList.filter((element) => {
        const selected = this.formAddMaxmin.value.digit1top.filter((selected) => {
          return selected.vipCode === element.code;
        });
        return !selected.length || element.code === vipCode;
      });
      return listFilter;
    }
    if (msdCode == LottoConstants.MSD_LOTTO_1DIGIT_BOT) {
      const listFilter = this.vipGroupList.filter((element) => {
        const selected = this.formAddMaxmin.value.digit1bot.filter((selected) => {
          return selected.vipCode === element.code;
        });
        return !selected.length || element.code === vipCode;
      });
      return listFilter;
    }
  }

  goBack() {
    this.router.navigate(['lotto-settings/lotto-yeekee']);
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
    /** check form */
    const controls = this.formAddMaxmin.controls;
    if (this.formAddMaxmin.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    console.log(this.formAddMaxmin)
    this.httpBeanService.doPost(URL.SAVE_MAXMIN, this.formAddMaxmin.value).subscribe(res => {
      if (res.status) {
        this.router.navigate(['lotto-settings/lotto-yeekee']);
      }
    })
  }

  onChange(index) {

    this.formAddMaxmin.controls.digit3top['controls'].forEach((element: FormGroup) => {
      element.controls.minimumTrans.updateValueAndValidity();
      element.controls.maximumTrans.updateValueAndValidity();
      element.controls.maximumUsername.updateValueAndValidity();
      element.controls.minimumTrans.markAllAsTouched();
      element.controls.maximumTrans.markAllAsTouched();
      element.controls.maximumUsername.markAllAsTouched();
    });

    this.formAddMaxmin.controls.digit3swap['controls'].forEach((element: FormGroup) => {
      element.controls.minimumTrans.updateValueAndValidity();
      element.controls.maximumTrans.updateValueAndValidity();
      element.controls.maximumUsername.updateValueAndValidity();
      element.controls.minimumTrans.markAllAsTouched();
      element.controls.maximumTrans.markAllAsTouched();
      element.controls.maximumUsername.markAllAsTouched();
    });

    this.formAddMaxmin.controls.digit2top['controls'].forEach((element: FormGroup) => {
      element.controls.minimumTrans.updateValueAndValidity();
      element.controls.maximumTrans.updateValueAndValidity();
      element.controls.maximumUsername.updateValueAndValidity();
      element.controls.minimumTrans.markAllAsTouched();
      element.controls.maximumTrans.markAllAsTouched();
      element.controls.maximumUsername.markAllAsTouched();
    });

    this.formAddMaxmin.controls.digit2bot['controls'].forEach((element: FormGroup) => {
      element.controls.minimumTrans.updateValueAndValidity();
      element.controls.maximumTrans.updateValueAndValidity();
      element.controls.maximumUsername.updateValueAndValidity();
      element.controls.minimumTrans.markAllAsTouched();
      element.controls.maximumTrans.markAllAsTouched();
      element.controls.maximumUsername.markAllAsTouched();
    });

    this.formAddMaxmin.controls.digit1top['controls'].forEach((element: FormGroup) => {
      element.controls.minimumTrans.updateValueAndValidity();
      element.controls.maximumTrans.updateValueAndValidity();
      element.controls.maximumUsername.updateValueAndValidity();
      element.controls.minimumTrans.markAllAsTouched();
      element.controls.maximumTrans.markAllAsTouched();
      element.controls.maximumUsername.markAllAsTouched();
    });

    this.formAddMaxmin.controls.digit1bot['controls'].forEach((element: FormGroup) => {
      element.controls.minimumTrans.updateValueAndValidity();
      element.controls.maximumTrans.updateValueAndValidity();
      element.controls.maximumUsername.updateValueAndValidity();
      element.controls.minimumTrans.markAllAsTouched();
      element.controls.maximumTrans.markAllAsTouched();
      element.controls.maximumUsername.markAllAsTouched();
    });
  }

}
