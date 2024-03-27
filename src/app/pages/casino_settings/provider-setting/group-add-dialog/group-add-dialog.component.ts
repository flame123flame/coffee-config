import { DialogSweetAlertService } from './../../../../service/DialogSweetAlert.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  SAVE_GAME_GROUP: 'game-group/save-game-group',
  EDIT_GAME_GROUP: 'game-group/edit-game-group',
  GET_PRODUCT_DROPDOWN: 'game-product-type/get-all-product',
  GET_BY_CODE: 'game-group/get-group-by-code/',
};
interface DialogData {
  name: string;
}
@Component({
  selector: 'app-group-add-dialog',
  templateUrl: './group-add-dialog.component.html',
  styleUrls: ['./group-add-dialog.component.scss']
})
export class GroupAddDialogComponent implements OnInit {
  header = '';
  form: FormGroup;
  productList = [];
  constructor(
    public dialogRef: MatDialogRef<GroupAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private httpService: BaseService
  ) {
    this.form = this.fb.group({
      code: [{ value: null, disabled: false }, Validators.required],
      nameTh: [null, Validators.required],
      nameEn: [null, Validators.required],
      productCode: [null]
    });
  }

  ngOnInit(): void {
    console.log(this.data);

    this.createHeader();
    if (this.data != null) {
      this.getGroupByCode(this.data);
    }
    // this.createForm(this.data);
    this.getDropdownProvider();
  }
  onNoClick(): void {
    console.log(this.form);
    this.dialogRef.close();
  }
  createHeader() {
    if (this.data == null) {
      this.header = 'ADD GROUP';
    } else {
      this.header = 'EDIT GROUP';
    }
  }
  createForm(data) {
    if (this.data) {
      this.form = this.fb.group({
        code: [null, Validators.required],
        nameTh: [null, Validators.required],
        nameEn: [null, Validators.required],
        productCode: [null]
      });
    }
  }
  onSave() {
    if (this.data == null) {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.httpService.doPost(URL.SAVE_GAME_GROUP, this.form.getRawValue()).subscribe(res => {
          if (MessageService.SAVE.SUCCESS == res.message) {
            this.dialogRef.close();
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          } else if (MessageService.SAVE.DUPLICATE_DATA == res.message) {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      })
    } else {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.EDIT, () => {
        this.httpService.doPut(URL.EDIT_GAME_GROUP, this.form.getRawValue()).subscribe(res => {
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
    this.httpService.doGet(URL.GET_PRODUCT_DROPDOWN).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.productList = res.data;
      }
    });

  }
  getGroupByCode(data) {
    let code = data.codeGG;
    this.httpService.doGet(URL.GET_BY_CODE + code).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.form.patchValue(res.data)
        this.form.controls.code.disable();
      }
    })
  }
}
