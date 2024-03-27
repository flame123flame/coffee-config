import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
import { RequestRespond } from 'src/app/models/RequestRespond';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';

const URL = {
  PAGINATE: "fw-user/paginate",
  MAIN: "fw-user",
  MAIN_ROLE: "fw-user-role"
}
interface roleRes {
  id?: number;
  code?: string;
  name: string;
  isDisable?: boolean;
  fwUserRoleMenuAccessRes?: any;
  fwUserCount?: any;
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: string;
  updatedDate?: Date;
}

interface fwUser {
  fwUsersId: number;
  username: string;
  realname?: string;
  fwUserRole?: string;
  fwUserRoleCode?: string;
  lastLoginIp?: string;
  createdBy?: string;
  updatedBy?: string;
  isDisable?: boolean;
  isActive?: boolean;
  lastLoginTime?: Date;
  createdDate?: Date;
  updatedDate?: Date;
  role?: any[];
}

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.scss']
})
export class NewAdminComponent implements OnInit {

  form: FormGroup
  formUpdatePassword: FormGroup

  roleList: roleRes[] = [];

  id: number = null
  type: string = "ADD"
  hide: boolean = true;
  hide2: boolean = true;

  constructor(private fb: FormBuilder
    , private baseSer: BaseService
    , private activatedRoute: ActivatedRoute
    , private router: Router
    , private cdr: ChangeDetectorRef) {
    activatedRoute.queryParams.subscribe(param => {
      if (param.id) {
        this.type = 'EDIT'
        this.id = param.id;
        let res = this.getUserById(param.id);
        console.log(res)
        res.then((res) => {
          console.log(res)
          this.createForm(res.data);
        })
      } else {
        this.createForm();
      }
    })
  }

  ngOnInit(): void {
    this.getRoleList();
  }


  createForm(data: fwUser = null) {
    if (data) {
      this.form = this.fb.group({
        id: [data.fwUsersId],
        username: [data.username, Validators.required],
        fwUserRoleCode: [[], Validators.required],
        isDisable: [data.isDisable, Validators.required]
      })
      this.formUpdatePassword = this.fb.group({
        password: [null, Validators.required],
        password2: [null, Validators.required],
      })
      let role = []
      data.role.forEach(element => {
        role.push(element.code)
      });
      this.form.controls.fwUserRoleCode.setValue(role);
    } else {
      this.form = this.fb.group({
        id: [null],
        username: [null, Validators.required],
        password: [null, Validators.required],
        password2: [null, Validators.required],
        fwUserRoleCode: [null, Validators.required],
        isDisable: [true, Validators.required]
      })
    }
  }

  getRoleList() {
    this.baseSer.doGet(URL.MAIN_ROLE).subscribe((res: RequestRespond<roleRes[]>) => {
      if (res.status == MessageService.MSG.SUCCESS) {
        this.roleList = res.data
      }
    })
  }

  async getUserById(id) {
    return this.baseSer.doGet(`${URL.MAIN}/${id}`).toPromise()
  }

  formValueChange(str: string) {
    this.form.get(str).updateValueAndValidity();
  }
  formUpdatePasswordValueChange(str: string) {
    this.formUpdatePassword.get(str).updateValueAndValidity();
  }

  onSave() {

    console.log("NewAdminComponent -> onSave -> this.form", this.form)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    if (!this.id && this.form.controls.password.value != this.form.controls.password2.value) {
      this.form.controls.password.setErrors({ notSame: this.form.controls.password.value })
      this.form.controls.password2.setErrors({ notSame: this.form.controls.password2.value })
      return
    }

    let body = this.form.value
    body.fwUserRoleMappingReqList = []
    this.form.controls.fwUserRoleCode.value.forEach(element => {
      body.fwUserRoleMappingReqList.push({ "fwRoleCode": element });
    });
    body.isDisable = !body.isDisable
    console.log("NewAdminComponent -> onSave -> body.", body)
    if (this.id) {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.baseSer.doPut(`${URL.MAIN}/${this.id}`, body).subscribe(res => {
          if (MessageService.MSG.SUCCESS = res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.status);
            this.goBack()

          }
          else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
            if (res.message == 'Duplicate Username') {
              this.form.controls.username.setErrors({ duplicateUsername: this.form.controls.username.value })
            }
          }
        })
      });
    } else {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.baseSer.doPost(URL.MAIN, body).subscribe(res => {
          if (MessageService.MSG.SUCCESS = res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.status);
            this.goBack()
          }
          else {
            if (res.message == 'Duplicate Username') {
              this.form.controls.username.setErrors({ duplicateUsername: this.form.controls.username.value })
            }
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      });
    }
  }

  onSavePassword() {
    console.log("onSavePassword -> this.formUpdatePassword", this.formUpdatePassword)
    if (this.formUpdatePassword.invalid) {
      this.formUpdatePassword.markAllAsTouched();
      return
    }
    if (this.formUpdatePassword.controls.password.value != this.formUpdatePassword.controls.password2.value) {
      this.formUpdatePassword.controls.password.setErrors({ notSame: this.formUpdatePassword.controls.password.value })
      this.formUpdatePassword.controls.password2.setErrors({ notSame: this.formUpdatePassword.controls.password2.value })
      return
    }
    this.baseSer.doPut(`${URL.MAIN}/${this.id}/password`, this.formUpdatePassword.value).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.goBack()
      }
      return
    })
  }

  goBack() {
    this.router.navigateByUrl('/admin-management')
  }


}
