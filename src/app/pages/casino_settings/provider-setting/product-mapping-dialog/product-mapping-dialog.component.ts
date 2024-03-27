import { DialogSweetAlertService } from './../../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../../service/message.service';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';

const URL = {
  SAVE_MAPPING: 'product-mapping-provider/save-mapping',
  EDIT_MAPPING: 'product-mapping-provider/edit-mapping',
  GET_BY_PRODUCT: "product-mapping-provider/get-mapping/",
  GET_ALL_PROVIDER: "game-provider/get-provider-list",
}
interface DialogData {
  name: string;
}
@Component({
  selector: 'app-product-mapping-dialog',
  templateUrl: './product-mapping-dialog.component.html',
  styleUrls: ['./product-mapping-dialog.component.scss']
})
export class ProductMappingDialogComponent implements OnInit {
  header = ""
  providerList = []
  tempProvider: any = [];
  form: FormGroup
  constructor(
    public dialogRef: MatDialogRef<ProductMappingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private httpService: BaseService) {
    this.form = this.fb.group({
      productCode: [{ value: null, disabled: true }],
      providerCode: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    this.getByProduct(this.data)
    this.getDropdownProvider()
  }
  onNoClick(): void {
    console.log(this.form);
    this.dialogRef.close();
  }

  onSave() {
    console.log(this.form.getRawValue());
    console.log(this.tempProvider);

    if (this.tempProvider == null) {
      console.log("save")
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.httpService.doPost(URL.SAVE_MAPPING, this.form.getRawValue()).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.dialogRef.close();
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      })

    } else {
      console.log("edit");
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.EDIT, () => {
        this.httpService.doPut(URL.EDIT_MAPPING, this.form.getRawValue()).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.dialogRef.close();
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      })

    }
  }
  getDropdownProvider() {
    this.httpService.doGet(URL.GET_ALL_PROVIDER).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.providerList = res.data;
      }
    });

  }
  getByProduct(data) {
    let productCode = data.codePD;
    this.httpService.doGet(URL.GET_BY_PRODUCT + productCode).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.tempProvider = res.data.providerCode;
        if (this.tempProvider == null) {
          this.form.patchValue({
            productCode: productCode
          })
        } else {
          this.form.patchValue(res.data)
        }

      }
    })
  }
}
