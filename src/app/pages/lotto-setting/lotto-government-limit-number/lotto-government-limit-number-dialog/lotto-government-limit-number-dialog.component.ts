import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { url } from 'inspector';
import { BeanService } from 'src/app/service/BeanService.service';
const URL = {
  LIMIT_NUMBER: 'limit-number',
  GET_DTL_LIST: 'limit-number/get-list-detail'
};

@Component({
  selector: 'app-lotto-government-limit-number-dialog',
  templateUrl: './lotto-government-limit-number-dialog.component.html',
  styleUrls: ['./lotto-government-limit-number-dialog.component.scss']
})
export class LottoGovernmentLimitNumberDialogComponent implements OnInit {



  lottoKind: string = null;
  lottoKindName: string = null;
  lottoClass: string = null;
  maskNumber = '000';
  id: number = null;
  form: FormGroup;
  dtlList;

  constructor(
    public dialogRef: MatDialogRef<LottoGovernmentLimitNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private baseSer: BeanService,
  ) {
    console.log(data);
    this.initDialog(data.data);
    this.getDtlList();
    data.data ? this.createForm(data.data.data) : this.createForm();
  }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(data = null) {
    if (data) {
      this.id = data.id;
      this.form = this.fb.group({
        number: [data.lottoNumber, Validators.required],
        price: [data.lottoGroupDtlCode, Validators.required]
      });
    } else {
      this.form = this.fb.group({
        number: [null, Validators.required],
        price: [null, Validators.required]
      });
    }
  }

  insertOne() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.baseSer.doPost(URL.LIMIT_NUMBER, this.prepareData()).subscribe(data => {
      this.onNoClick();
    });
  }

  getDtlList() {
    this.baseSer.doGet(`${URL.GET_DTL_LIST}/${this.lottoClass}/${this.lottoKind}`).subscribe(data => {
      this.dtlList = data.data;
    });
  }

  prepareData() {
    let param = {
      lottoNumber: this.form.controls.number.value,
      lottoPrice: this.form.controls.price.value,
      enable: false,
      isManual: true,
      msdLottoKindCode: this.lottoKind,
      lottoClassCode: this.lottoClass,
      limitNumberId: null
    };
    if (this.id) {
      param.limitNumberId = this.id;
    }
    return param;
  }

  initDialog(data) {
    this.lottoKind = data.lottoKind;
    this.lottoKindName = data.kindName;
    this.lottoClass = data.lottoClass;

    /*
    kind for mask
    */
    const kindCount = this.lottoKind[0];
    if ('1' === kindCount) {
      this.maskNumber = '0';
    } else if ('2' === kindCount) {
      this.maskNumber = '00';
    } else if ('3' === kindCount) {
      this.maskNumber = '000';
    }
  }

}
