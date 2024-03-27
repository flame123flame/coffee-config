import { BaseService } from './../../../service/BaseService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BeanService } from './../../../service/BeanService.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
const URL = {
  MAIN: 'lotto-group-number',
  MAIN_CHILD: 'lotto-group-number-child',
  GET_BY_ID: 'lotto-group-number/get-by-id',
  GET_MSD: 'msd-lotto-kind/get-all-msd',
  GET_ALL_CUS: 'customer/get-customer-all',
}
interface msdLotto {
  msdLottoKindId: number;
  requireDigit: number;
  msdLottoKindCode: string;
  msdLottoKindName: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: any;
  updatedAt?: any;
}


export interface LottoGroupNumberChildList {
  id: number;
  lottoNumber: string;
  lottoKind: string;
  createdDate: Date;
  createdBy: string;
  updatedBy: string;
  updatedDate: Date;
  lottoGroupNumberCode: string;
  lottoGroupNumberChildCode: string;
}

export interface resData {
  id: number;
  createdDate: Date;
  updatedDate: Date;
  updatedBy: string;
  createdBy: string;
  name: string;
  lottoNumberGroupCode: string;
  usernameOwner: string;
  lottoGroupNumberChildList: LottoGroupNumberChildList[];
  lottoGroupNumberChildCount: number;
}


@Component({
  selector: 'app-lotto-group-add-edit',
  templateUrl: './lotto-group-add-edit.component.html',
  styleUrls: ['./lotto-group-add-edit.component.scss']
})
export class LottoGroupAddEditComponent implements OnInit {

  pageTitle = 'Add Group Number'

  msdList: msdLotto[] = []
  lottoGroup: FormGroup;
  items: FormArray;
  id = null
  // usernameList = [{username:'admin'}]


  constructor(private router: Router,private beanSer: BeanService, private baseSer: BaseService, private formBuilder: FormBuilder, private activateRoute: ActivatedRoute) {
    this.activateRoute.queryParams.subscribe(param => {
      if (param.id) {
        this.pageTitle = 'Edit Group Number'

        this.id = param.id
        this.getById(param.id);
      } else {
        this.createForm();
      }
    })
  }

  ngOnInit() {
    this.getMsdList();
    // this.getUsernameList();
  }

  createForm(data: resData = null) {
    if (data) {
      this.lottoGroup = this.formBuilder.group({
        id: [data.id],
        name: [data.name, Validators.required],
        usernameOwner: [data.usernameOwner, Validators.required],
        lottoGroupNumberChildList: new FormArray([])
      })
      data.lottoGroupNumberChildList.forEach(element => {
        this.addItem(element.id, element.lottoNumber, element.lottoKind)
      })
    } else {
      this.lottoGroup = this.formBuilder.group({
        id: [null],
        name: [null, Validators.required],
        usernameOwner: ["admin", Validators.required],
        lottoGroupNumberChildList: new FormArray([])
      })
      this.addItem()
    }
  }

  // getUsernameList(){
  //   this.baseSer.doGet(URL.GET_ALL_CUS).subscribe(res => {
  //     if (res.status == 'SUCCESS') {
  //       this.usernameList = [...this.usernameList,...res.data]
  //     }
  //   })
  // }

  createItem(id = null, number = null, kind = null): FormGroup {
    return this.formBuilder.group({
      id: [id],
      lottoNumber: [number, Validators.required],
      lottoKind: [kind, Validators.required],
    });
  }

  addItem(id = null, number = null, kind = null): void {
    this.items = this.lottoGroup.get('lottoGroupNumberChildList') as FormArray;
    this.items.push(this.createItem(id, number, kind));
  }



  getMsdList() {
    this.beanSer.doGet(URL.GET_MSD).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.msdList = res.data
      }
    })
  }

  getById(id) {
    this.baseSer.doGet(`${URL.GET_BY_ID}/${id}`).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.createForm(res.data);
      }
    })
  }

  save() {
    if (!this.lottoGroup.valid) {
      this.lottoGroup.markAllAsTouched();
      return
    }
    this.removeData();
    if (this.id) {
      this.baseSer.doPut(`${URL.MAIN}`, this.lottoGroup.value).subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.router.navigate(["lotto-settings/lotto-group"]);
        }
      })
      return
    }
    this.baseSer.doPost(`${URL.MAIN}`, this.lottoGroup.value).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.router.navigate(["lotto-settings/lotto-group"]);

      }
    })
  }


  removeArr: number[] = []
  remove(index) {
    console.log(this.lottoGroup.controls.lottoGroupNumberChildList);
    if (this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['value']['id']) {
      this.removeArr.push(this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['value']['id'])
    }
    this.lottoGroup.controls.lottoGroupNumberChildList['controls'].splice(index, 1)
    this.lottoGroup.controls.lottoGroupNumberChildList['value'].splice(index, 1)
  }


  async removeData() {
    console.log(this.removeArr)
    this.removeArr.forEach(element => {
      let res = this.deleteId(element)
    });
  }

  async deleteId(id) {
    return await this.baseSer.doDelete(`${URL.MAIN_CHILD}/${id}`).toPromise();
  }

  setValidate(index,code){
    // console.log(this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]);

    this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].clearValidators();
    this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].clearAsyncValidators();
    this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].setValidators([Validators.required,Validators.minLength(this.getMin(code)),Validators.maxLength(this.getMin(code)),Validators.pattern(/^[0-9]\d*$/)])
    this.lottoGroup.controls.lottoGroupNumberChildList['controls'][index]['controls']['lottoNumber'].updateValueAndValidity();
  }

  cancle(){
    // console.log(this.lottoGroup)

    this.router.navigate(["lotto-settings/lotto-group"]);
  }

  getMin(code){
    if(code==null)return 10;
    let index = this.msdList.findIndex(x=>x.msdLottoKindCode == code)
    if (index >= 0) {
     return this.msdList[index].requireDigit
    }
    return 10
  }

}
