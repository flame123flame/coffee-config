import { DialogSweetAlertService } from './../../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../../service/message.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
const URL = {
  SAVE_LANDING: 'landing/save-landing',
  EDIT_LANDING: 'landing/edit-landing',
  GET_LANDING_BY_ID: 'landing/get-landing-by-id/',
}
@Component({
  selector: 'app-landing-setting-add',
  templateUrl: './landing-setting-add.component.html',
  styleUrls: ['./landing-setting-add.component.scss']
})
export class LandingSettingAddComponent implements OnInit {
  form: FormGroup;
  fileName = '';
  file = '';
  tmp: any = '';
  constructor(
    private fb: FormBuilder,
    private httpService: BaseService,
    private router: Router,
    private location: Location,
    private avtivateRoute: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      id: [null],
      header: [null],
      detail: [null],
      img: [null],
      configPath: [null],
    })
  }

  ngOnInit(): void {
    const id = this.avtivateRoute.snapshot.queryParams['id'];

    if (id) {
      this.getLandingById(id)
    }
  }

  onCancel() { this.location.back(); }
  onSubmit() {
    if (this.form.status == 'VALID') {
      if (this.form.controls.id.value == null) {
        DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
          this.httpService.doPost(URL.SAVE_LANDING, this.form.value).subscribe(res => {
            if (MessageService.MSG.SUCCESS == res.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message)
              this.location.back();
            } else {
              DialogSweetAlertService.opentModalSweetAlertError('', res.message)
            }
          })
        })

      } else {
        DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.EDIT, () => {
          this.httpService.doPut(URL.EDIT_LANDING, this.form.value).subscribe(res => {
            if (MessageService.MSG.SUCCESS == res.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message)
              this.location.back();
            } else {
              DialogSweetAlertService.opentModalSweetAlertError('', res.message)
            }
          })
        })
      }
    }
  }
  getLandingById(id) {
    this.httpService.doGet(URL.GET_LANDING_BY_ID + id).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.form.patchValue({
          id: res.data.id,
          configPath: res.data.configPath,
          detail: res.data.detail,
          header: res.data.header,
          img: res.data.img,
        })
      }
    })
  }

  preview(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    const sizeFile = files[0].size;
    const mimeType = files[0].type;
    this.fileName = files[0].name;
    this.file = files[0];
    console.log(reader);

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      console.log(reader.result);
      this.tmp = reader.result;
      // this.formAddGroupLv.patchValue({
      //   groupIconImg: this.tmp
      // })
    };
  }
}
