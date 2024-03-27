import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { LottoConfigDialogConfirmComponent } from '../lotto-config/lotto-config-dialog-confirm/lotto-config-dialog-confirm.component';
import { MatTable } from '@angular/material/table';

const URL = {
  VIP_PRIZE: 'group-risk2/get-group-risk-vip-prize-setting',
  PRIZE_BY_ID: 'group-risk2/get-group-risk-prize-setting-by-id',
}

export class VipGroupList {
  vipCode: string;
  vipName: string; //list?
  // prizeList: PrizeList;
}
export class PrizeList {
  code: string;
  name: string; //list?
}

@Component({
  selector: 'app-lotto-config-add-prize',
  templateUrl: './lotto-config-add-prize.component.html',
  styleUrls: ['./lotto-config-add-prize.component.scss']
})
export class LottoConfigAddPrizeComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  vipGroupList = [];
  columns: any = [
    { header: 'VIP', field: 'vipName' },
  ];
  tr: any = [
    'vipName',
  ];

  title = 'สามตัวบน';
  lottoClassCode = '';
  lottoGroupCode = '';
  msdLottoKindCode = '';
  msdLottoKindName = '';


  vipList = [];
  dtlCode = [];

  formArr: FormArray = null;
  formGroup: FormGroup = null;
  items: FormArray = null;


  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private httpBaseService: BaseService,
    private fromBuilder: FormBuilder,
    private _location: Location
  ) {
    this.formArr = fromBuilder.array([]);
    this.formGroup = fromBuilder.group({
      myArr : this.formArr
    });
    this.routeParam.queryParams.subscribe(data => {
      if (data) {
        this.title = data.className;
        this.lottoClassCode = data.classCode;
        this.lottoGroupCode = data.groupCode,
          this.msdLottoKindCode = data.msdLottoKindCode;
        this.msdLottoKindName = data.msdLottoKindName;
      }
    });
    this.getRowAndColList(this.lottoClassCode, this.msdLottoKindCode, this.lottoGroupCode);
  }

  ngOnInit(): void {
  }

  async getRowAndColList(classCode, kindCode, groupCode) {
    let res = await this.httpBeanService.doGet(`${URL.VIP_PRIZE}?lottoClassCode=${classCode}&msdLottoKindCode=${kindCode}&lottoGroupCode=${groupCode}`).toPromise()
    console.log("LottoConfigAddPrizeComponent -> getRowAndColList -> res", res)
    await res.data['lottoGroup'].forEach(element => {
      this.columns.push(
        { header: element.percentForLimit + '%', field: element.lottoGroupDtlCode, type: 'number' },
      );
      this.tr.push(
        element.lottoGroupDtlCode
      );
      this.dtlCode.push(
        
        element.lottoGroupDtlCode
      );
      console.log(element.lottoGroupDtlCode)
    });
    this.getPrizeSettingById(this.dtlCode, res.data['groupMaxmin']);
  }

  onSave(event) {
    this.formGroup.controls.myArr['controls'].forEach((element:FormGroup) => {
      for (const key in element.controls) {
        element.controls[key].updateValueAndValidity()
      }
    });
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return
    }
    const dialogRef = this.dialog.open(LottoConfigDialogConfirmComponent, { data: { status: 'SAVE' }, width: '100' });
    dialogRef.afterClosed().subscribe(async(result) => {
      console.log('The dialog was closed');
      if (result === 'SAVE') {
        let data = this.prepareData()
        console.log("LottoConfigAddPrizeComponent -> onSave -> data", data)
        if (Object.entries(data.edit['prizeListSetting']).length!=0){
          let editRes = await this.update(data.edit);
            if(editRes.status != 'SUCCESS'){
              alert("Save/edit failed please try again")
              return;
            }
            console.log("LottoConfigAddPrizeComponent -> onSave -> editRes", editRes)
        }
        if (Object.entries(data.save['prizeListSetting']).length!=0){
          let saveRes = await this.save(data.save);
          if(saveRes.status != 'SUCCESS'){
            alert("Save/edit failed please try again")
            return;
          }
          console.log("LottoConfigAddPrizeComponent -> onSave -> saveRes", saveRes)
        }
        this.router.navigate(['lotto-settings/lotto-government/lotto-config/'],
          { queryParams: { classCode: this.lottoClassCode, groupCode: null, className: this.title } }
        );
      }
    });
  }

  prepareData() {
    let vipListSave = []
    let vipListEdit = []
    this.vipGroupList.forEach((element1, index) => {
      let prizeSettingSaveList = [];
      let prizeSettingEditList = [];
      this.dtlCode.forEach((dtlCode) => {
        if (element1.prizeSettingIdList.find(x => x.field == dtlCode).id) {
          prizeSettingEditList.push({
            id: element1.prizeSettingIdList.find(x => x.field == dtlCode).id,
            lottoGroupCode: this.lottoGroupCode,
            msdLottoKindCode: this.msdLottoKindCode,
            lottoGroupDtlCode: dtlCode,
            prizeSettingId: element1.prizeSettingIdList.find(x => x.field == dtlCode).id,
            prize: element1[dtlCode],
          });
        } else {
          prizeSettingSaveList.push({
            lottoGroupCode: this.lottoGroupCode,
            msdLottoKindCode: this.msdLottoKindCode,
            lottoGroupDtlCode: dtlCode,
            prizeSettingId: element1.prizeSettingIdList.find(x => x.field == dtlCode).id,
            prize: element1[dtlCode],
          });
        }
      });

      if(prizeSettingSaveList.length != 0){
        vipListSave.push({
          vipCode: element1.vipCode,
          lottoGroupCode: this.lottoGroupCode,
          list: prizeSettingSaveList,
        });
      }
      if(prizeSettingEditList.length != 0){
        vipListEdit.push({
          vipCode: element1.vipCode,
          lottoGroupCode: this.lottoGroupCode,
          list: prizeSettingEditList,
        });
      }

    });
    let prizeSettingModelSave ={ prizeListSetting: vipListSave };
    let prizeSettingModelEdit ={ prizeListSetting: vipListEdit };
    return { save: prizeSettingModelSave, edit: prizeSettingModelEdit }
  }

  async save(data) {
    return await this.httpBeanService.doPost('group-risk2/add-group-risk-prize-setting', data).toPromise();
  }

  async update(data) {
    return await this.httpBeanService.doPost('group-risk2/edit-group-risk-prize-setting', data).toPromise();
  }

  onCancel(): void {
    console.log(this.formGroup)
    this._location.back();
  }

  async getPrizeSettingById(dtlCode, groupMaxmin) {
    console.log("LottoConfigAddPrizeComponent -> getPrizeSettingById -> groupMaxmin", groupMaxmin)
    let list = [];
    let res = await this.httpBeanService.doGet(`${URL.PRIZE_BY_ID}?msdLottoKindCode=${this.msdLottoKindCode}&lottoGroupCode=${this.lottoGroupCode}`).toPromise();
    console.log("LottoConfigAddPrizeComponent -> getPrizeSettingById -> res", res)
    if (res.data.length == 0) {
      let prizeList = []
      await dtlCode.forEach(element => {
        prizeList.push(
          {
            field: element,
            id: null
          }
        )
      });
      groupMaxmin.forEach(async (element, index) => {
        if (element.vipCode === 'DEFAULT') {
          list.push(
            {
              vipCode: element.vipCode,
              vipName: 'DEFAULT',
              prizeSettingIdList: prizeList
            }
          );
          dtlCode.forEach(element => {
            list[index][element] = null
          });
          this.vipGroupList = list;
          this.createFormArr(dtlCode)
          console.log("LottoConfigAddPrizeComponent -> getPrizeSettingById -> this.vipGroupList", this.vipGroupList)
          this.table.renderRows();
        }
        else {
          this.httpBaseService.doGet('groupLevel/getGroupLevelByGroupCode/' + element.vipCode).subscribe(res1 => {
            console.log("LottoConfigAddPrizeComponent -> getPrizeSettingById -> res1", res1)
            if (res1.data.groupCode === element.vipCode) {
              list.push(
                {
                  vipCode: element.vipCode,
                  vipName: res1.data.groupName,
                  prizeSettingIdList: prizeList
                }
              );
              dtlCode.forEach(element => {
                list[index][element] = null
              });
            }
            this.vipGroupList = list;
            this.createFormArr(dtlCode)
            console.log("LottoConfigAddPrizeComponent -> getPrizeSettingById -> this.vipGroupList", this.vipGroupList)
            this.table.renderRows();
          });

        }
      });

    }
    else {
      res.data.forEach(data => {
        let tmp = list.find(list => list.vipCode === data.vipCode);
        if (list.length == 0) {
          list.push({
            vipCode: data.vipCode,
            vipName: 'DEFAULT',
          });
        }
        else if (tmp == undefined) {

          list.push({
            vipCode: data.vipCode,
            vipName: null, data
          });
        }
      });

      // setting vipName & setting KEY(prize)
      list.forEach(async element => {
        // setting KEY(prize)
        dtlCode.forEach(dtl => {
          element[dtl] = null;
        });
        // setting vipName
        if (element.vipCode != 'DEFAULT') {
          let res1 = await this.httpBaseService.doGet('groupLevel/getGroupLevelByGroupCode/' + element.vipCode).toPromise()
          console.log("LottoConfigAddPrizeComponent -> getPrizeSettingById -> res1", res1)
          if (res1.data.groupCode === element.vipCode) {
            element['vipName'] = res1.data.groupName;
          };
        }
      });

      list.forEach(ele => {
        ele['prizeSettingIdList'] = []
        dtlCode.forEach(element => {
          ele.prizeSettingIdList.push(
            {
              field: element,
              id: null
            }
          )
        });

      })
      res.data.forEach(element => {
        let index = list.findIndex(x => x.vipCode == element.vipCode);
        if (index >= 0) {
          list[index][element.lottoGroupDtlCode] = null
          list[index][element.lottoGroupDtlCode] = element.prize
          let i = list[index].prizeSettingIdList.findIndex(x => x.field == element.lottoGroupDtlCode);
          list[index].prizeSettingIdList[i] = {
            field: element.lottoGroupDtlCode,
            id: element.prizeSettingId
          }
        }
      });
      this.vipGroupList = list;
      this.createFormArr(dtlCode)
      console.log("LottoConfigAddPrizeComponent -> getPrizeSettingById -> this.vipGroupList", this.vipGroupList)
      this.table.renderRows();
    }
  }


  createFormArr(dtlCode) {
    this.formArr = this.fromBuilder.array([]);
    this.vipGroupList.forEach(element => {
      this.addItem(dtlCode)
    });
    dtlCode.forEach((x, index) => {
      this.formArr.controls.forEach((a: FormGroup, i) => {
        if (index != 0) {
          console.log(dtlCode)
          console.log(index)
          console.log(dtlCode[index-1])
          a.controls[x].setValidators([Validators.required,this.greaterThan(dtlCode[index-1])]);
          a.controls[x].updateValueAndValidity()
        }
      });
    });
    this.formGroup = this.fromBuilder.group({
      myArr: this.formArr
    })
    console.log("getPrizeSettingById -> this.formGroup", this.formGroup)
  }

  addItem(arr: string[]): void {
    let formObj = {};
    arr.forEach((element, index) => {
      if (index == 0) {
        formObj[element] = [null, Validators.required];
      } else {
        formObj[element] = [null, Validators.required];
      }
    });
    console.log("addItem -> formObj", formObj)
    this.items = this.formArr as FormArray;
    this.items.push(this.fromBuilder.group(formObj));
  }


  greaterThan(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const group = control.parent;
      const fieldToCompare = group.get(field);
      const isLessThan = Number(fieldToCompare.value) < Number(control.value);
      return isLessThan ? { lessThan: { value: control.value } } : null;
    };
  }
}
