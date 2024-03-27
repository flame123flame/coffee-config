import { MessageService } from 'src/app/service/message.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTagDialogComponent } from 'src/app/pages/player_management/tag-management/new-tag-dialog/new-tag-dialog.component';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
const URL = {
  SAVE_PROVIDER: 'game-provider/save-provider',
  EDIT_PROVIDER: 'game-provider/edit-provider',
  SAVE_PRODUCT: 'game-product-type/save-product',
  EDIT_PRODUCT: 'game-product-type/edit-product',
  SAVE_GAME_GROUP: 'game-group/save-game-group',
  EDIT_GAME_GROUP: 'game-group/edit-game-group',
  GET_PROVIDER_BY_ID: 'game-provider',
};
@Component({
  selector: 'app-provider-add-dialog',
  templateUrl: './provider-add-dialog.component.html',
  styleUrls: ['./provider-add-dialog.component.scss'],
})
export class ProviderAddDialogComponent implements OnInit {
  header = '';

  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NewTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private httpService: BaseService
  ) { }

  ngOnInit() {
    this.createHeader();
    this.createForm(this.data);
    if (this.data['type'] == 'provider') {
      if (this.data['data'] != null) {
        this.getProviderById(this.data.data.codePV);
      }
    }
  }

  onNoClick(): void {
    // console.log(this.form);
    this.dialogRef.close();
  }
  createHeader() {
    if (this.data) {
      if (this.data['type'] == 'provider') {
        if (this.data['data'] == null) {
          this.header = 'ADD PROVIDER';
        } else {
          this.header = 'EDIT PROVIDER';
        }
      } else if (this.data['type'] == 'product') {
        if (this.data['data'] == null) {
          this.header = 'ADD PRODUCT TYPE';
        } else {
          this.header = 'EDIT PRODUCT TYPE';
        }
      }
      // else if (this.data['type'] == 'group') {
      //   if (this.data['data'].codeGG == null) {
      //     this.header = "ADD GAME GROUP"
      //   } else {
      //     this.header = "EDIT GAME GROUP"
      //   }

      // }
    }
  }
  createForm(data) {
    console.log(data);
    if (this.data) {
      if (this.data['type'] == 'provider') {
        this.form = this.fb.group({
          code: [null, Validators.required],
          nameTh: [null, Validators.required],
          nameEn: [null, Validators.required],
          iconPortrait: [null, Validators.required],
          iconLandscape: [null, Validators.required],
          status: [true, Validators.required],
          openType: [null, Validators.required],
        });
      } else if (this.data['type'] == 'product') {
        if (data['data']) {
          this.form = this.fb.group({
            code: [{ value: data.data.codePD, disabled: true }],
            nameTh: [data.data.nameThPD, Validators.required],
            nameEn: [data.data.nameEnPD, Validators.required],
            icon: [data.data.iconUrl, Validators.required],
          });
        } else {
          this.form = this.fb.group({
            code: [null, Validators.required],
            nameTh: [null, Validators.required],
            nameEn: [null, Validators.required],
            icon: [null, Validators.required],
          });
        }
      }
      // else if (this.data['type'] == 'group') {
      //   if (data['data'].codeGG) {
      //     this.form = this.fb.group({
      //       code: [data.data.codeGG],
      //       game_product_type_code: [data.data.codePD],
      //       nameTh: [data.data.nameThGG, Validators.required],
      //       nameEn: [data.data.nameEnGG, Validators.required]
      //     })
      //   } else {
      //     this.form = this.fb.group({
      //       game_product_type_code: [data.data.codePD],
      //       nameTh: [null, Validators.required],
      //       nameEn: [null, Validators.required]
      //     })
      //   }
      // }
    }
  }

  onSave() {
    let data = this.form.value;
    if (this.data['type'] == 'provider') {
      if (this.data['data']) {
        console.log(this.form.getRawValue());
        DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.EDIT, () => {
          this.httpService.doPut(URL.EDIT_PROVIDER, this.form.getRawValue()).subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.dialogRef.close();
              DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
            } else {
              DialogSweetAlertService.opentModalSweetAlertError('', res.message);
            }
          });
        })

      } else {
        DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
          this.httpService.doPost(URL.SAVE_PROVIDER, data).subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.dialogRef.close();
              DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
            } else {
              DialogSweetAlertService.opentModalSweetAlertError('', res.message);
            }
          });
        })
      }
    } else if (this.data['type'] == 'product') {
      if (this.data['data']) {
        console.log('edit', this.form.getRawValue());
        DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
          this.httpService.doPut(URL.EDIT_PRODUCT, this.form.getRawValue()).subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.dialogRef.close();
              DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
            } else {
              DialogSweetAlertService.opentModalSweetAlertError('', res.message);
            }
          });
        })

      } else {
        DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
          this.httpService.doPost(URL.SAVE_PRODUCT, data).subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.dialogRef.close();
              DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
            } else {
              DialogSweetAlertService.opentModalSweetAlertError('', res.message);
            }
          });
        })

      }
    }
  }

  getProviderById(id) {
    this.httpService.doGet(`${URL.GET_PROVIDER_BY_ID}/${id}`).subscribe(res => {
      this.form.controls.code.setValue(res.data.code);
      this.form.controls.nameTh.setValue(res.data.nameTh);
      this.form.controls.nameEn.setValue(res.data.nameEn);
      this.form.controls.iconPortrait.setValue(res.data.iconPortrait);
      this.form.controls.iconLandscape.setValue(res.data.iconLandscape);
      this.form.controls.status.setValue(res.data.statusView == 1 ? true : false);
      this.form.controls.openType.setValue(res.data.openType);
      this.imgPreviewLandscape = res.data.iconLandscape
      this.imgPreviewPortrait = res.data.iconPortrait
    })
  }


  imgPreviewPortrait = null;
  previewPortrait(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.form.get('iconPortrait').patchValue(reader.result);
      this.imgPreviewPortrait = reader.result
    };
  }
  imgPreviewLandscape = null;

  previewLandscape(files) {
    const reader2 = new FileReader();
    if (files.length === 0) {
      return;
    }

    reader2.readAsDataURL(files[0]);
    reader2.onload = (_event) => {
      this.form.get('iconLandscape').patchValue(reader2.result);
      this.imgPreviewLandscape = reader2.result
    };
  }

  imgPreview = null;

  preview(files) {
    const reader3 = new FileReader();
    if (files.length === 0) {
      return;
    }

    reader3.readAsDataURL(files[0]);
    reader3.onload = (_event) => {
      this.form.get('icon').patchValue(reader3.result);
      this.imgPreviewLandscape = reader3.result
    };
  }

}
