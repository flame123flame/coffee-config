import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeanService } from 'src/app/service/BeanService.service';
const URL = {
  CLOSE_NUMBER: 'close-number/add-lotto-close-number',
  GET_DTL_LIST: 'close-number/get-list-detail'
};


@Component({
  selector: 'app-lotto-government-close-number-dialog',
  templateUrl: './lotto-government-close-number-dialog.component.html',
  styleUrls: ['./lotto-government-close-number-dialog.component.scss']
})
export class LottoGovernmentCloseNumberDialogComponent implements OnInit {

  lottoKind: string = null;
  lottoKindName: string = null;
  lottoClass: string = null;
  closeId
  maskNumber = '000';
  id: number = null;
  form: FormGroup;
  dtlList;

  constructor(
    public dialogRef: MatDialogRef<LottoGovernmentCloseNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private baseSer: BeanService,
  ) {
    console.log(data);
    this.initDialog(data.data);
    data.data ? this.createForm(data.data.data) : this.createForm();
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(data = null) {
    if (data) {
      this.id = data.id;
      this.form = this.fb.group({
        number: [data.lottoNumber, Validators.required],
      });
    } else {
      this.form = this.fb.group({
        number: [null, Validators.required],
      });
    }
  }

  insertOne() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.baseSer.doPost(URL.CLOSE_NUMBER, this.prepareData()).subscribe(data => {
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
      enable: false,
      isManual: true,
      msdLottoKindCode: this.lottoKind,
      lottoClassCode: this.lottoClass,
      closeNumberId: null
    };
    if (this.id) {
      param.closeNumberId = this.id;
    }
    return param;
  }

  initDialog(data) {
    this.lottoKind = data.lottoKind;
    this.lottoKindName = data.kindName;
    this.lottoClass = data.lottoClass;
    this.closeId = data.closeNumberId;
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
