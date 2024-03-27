import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTagDialogComponent } from 'src/app/pages/player_management/tag-management/new-tag-dialog/new-tag-dialog.component';
import { BaseService } from 'src/app/service/BaseService.service';
const URL = {
  DEFAULT: 'games'
}

@Component({
  selector: 'app-game-list-display-name-dialog',
  templateUrl: './game-list-display-name-dialog.component.html',
  styleUrls: ['./game-list-display-name-dialog.component.scss']
})
export class GameListDisplayNameDialogComponent implements OnInit {

  form: FormGroup
  constructor(public dialogRef: MatDialogRef<NewTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private tagSer: BaseService) { }

  ngOnInit() {
    console.log(this.data);

    this.createForm(this.data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(data) {
    if (data) {
      this.form = this.fb.group({
        game_code: [{ value: data.data.gameCode, disabled: true }, Validators.required],
        nameTh: [data.data.nameTh, Validators.required],
        nameEn: [data.data.nameEn, Validators.required]
      })
      return
    }
    this.form = this.fb.group({
      game_code: [null, Validators.required],
      nameTh: [null, Validators.required],
      nameEn: [null, Validators.required]
    })
  }

  insertOne() {
    let data = this.form.value;
    if (this.data) {
      data.id = this.data['data']['id']
      this.tagSer.doPut(URL.DEFAULT, data).subscribe(data => {
        this.onNoClick();
      })
    } else {
      this.tagSer.doPost(URL.DEFAULT, data).subscribe(data => {
        this.onNoClick();
      })
    }
  }

}
