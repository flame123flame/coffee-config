import { MessageService } from './../../../../service/message.service';
import { RequestRespond } from './../../../../models/RequestRespond';
import { GameTagModel } from './../../../../models/respons-interface/GameTag';
import { BaseService } from 'src/app/service/BaseService.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/pages/player_management/hot-issue/hot-issue-dialog/hot-issue-dialog.component';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
const URL = {
  GET_BY_ID : 'game-tag/get-by-id',
  GAME_TAG : 'game-tag'
}
@Component({
  selector: 'app-game-tag-edit-dialog',
  templateUrl: './game-tag-edit-dialog.component.html',
  styleUrls: ['./game-tag-edit-dialog.component.scss']
})
export class GameTagEditDialogComponent implements OnInit {

  statusList = [{ display: 'Active', value: true }, { display: 'Disable', value: false }]

  viewList = [{ display: '8 VIEW', value: '8VIEW' }, { display: '2 VIEW', value: '2VIEW' }]

  form : FormGroup;

  constructor(public dialogRef: MatDialogRef<GameTagEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private baseSer:BaseService,
    private fb: FormBuilder) {
    this.getById(data.id)
    this.createForm()
  }

  ngOnInit() {

  }

  getById(id){
    this.baseSer.doGet(`${URL.GET_BY_ID}/${id}`).subscribe((res:RequestRespond<GameTagModel>)=>{
      if (res.status === MessageService.MSG.SUCCESS) {
        this.setForm(res.data)
      }
    })
  }

  createForm(){
    this.form = this.fb.group({
      code:[],
      nameTh:[],
      nameEn:[],
      isActive:[],
      userView:[],
      priority:[],
    })
  }

  setForm(data:GameTagModel){
    this.form.controls.code.setValue(data.code);
    this.form.controls.nameTh.setValue(data.nameTh);
    this.form.controls.nameEn.setValue(data.nameEn);
    this.form.controls.isActive.setValue(data.isActive);
    this.form.controls.userView.setValue(data.userView);
    this.form.controls.priority.setValue(data.priority);
  }

  editGameTag() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.baseSer.doPut(`${URL.GAME_TAG}/${this.data.id}`, this.form.value).subscribe(res => {
        if (res.status == MessageService.MSG.SUCCESS) {
          this.dialogRef.close()
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          this.dialogRef.close()
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    });

  }


}
