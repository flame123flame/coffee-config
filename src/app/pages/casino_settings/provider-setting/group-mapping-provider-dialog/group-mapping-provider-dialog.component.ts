import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  SAVE_MAPPING: 'group-mapping-provider/save-mapping',
  EDIT_MAPPING: 'group-mapping-provider/edit-mapping',
  GET_BY_GROUP: "group-mapping-provider/get-mapping/",
  GET_ALL_PROVIDER: "game-provider/get-provider-list",
}
interface DialogData {
  name: string;
}
@Component({
  selector: 'app-group-mapping-provider-dialog',
  templateUrl: './group-mapping-provider-dialog.component.html',
  styleUrls: ['./group-mapping-provider-dialog.component.scss']
})
export class GroupMappingProviderDialogComponent implements OnInit {
  header = ""
  providerList = []
  tempProvider: any = [];
  form: FormGroup
  constructor(
    public dialogRef: MatDialogRef<GroupMappingProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private httpService: BaseService
  ) {
    this.form = this.fb.group({
      groupCode: [{ value: null, disabled: true }, Validators.required],
      providerCode: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    this.getByGroup(this.data);
    this.getDropdownProvider()
  }

  onNoClick(): void {
    console.log(this.form);
    this.dialogRef.close();
  }

  getDropdownProvider() {
    this.httpService.doGet(URL.GET_ALL_PROVIDER).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.providerList = res.data;
      }
    });

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

  getByGroup(data) {
    let groupCode = data.codeGG;
    this.httpService.doGet(URL.GET_BY_GROUP + groupCode).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.tempProvider = res.data.providerCode;
        if (this.tempProvider == null) {
          this.form.patchValue({
            groupCode: groupCode
          })
        } else {
          this.form.patchValue(res.data)
        }
      }
    })

  }
}
