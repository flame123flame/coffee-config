import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTagDialogComponent } from 'src/app/pages/player_management/tag-management/new-tag-dialog/new-tag-dialog.component';
import { BaseService } from 'src/app/service/BaseService.service';

@Component({
  templateUrl: './promotion-request-dialog.component.html',
  styleUrls: ['./promotion-request-dialog.component.scss']
})
export class PromotionRequestDialogComponent implements OnInit {

  form: FormGroup
  constructor(public dialogRef: MatDialogRef<NewTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private tagSer: BaseService) { }

  ngOnInit() {
    this.createForm()
  }

  onNoClick(): void {
    console.log(this.form);

    this.dialogRef.close();
  }

  createForm() {
    this.form = this.fb.group({
      nameTh: [null, Validators.required],
      nameEn: [null, Validators.required],
      gameCode: [null, Validators.required],
      gameGroupCode: [null, Validators.required],
      minRtp: [null, Validators.required],
      maxRtp: [null, Validators.required],
      gameTag: [null, Validators.required],
      displayName: [null, Validators.required],
      remark: [null, Validators.required],
      status: [1, Validators.required],
      enable: [1, Validators.required],
      platformMapp: [false, Validators.required],
      platformMhFive: [false, Validators.required],
      platformMini: [false, Validators.required],
      platformPcDl: [false, Validators.required],
      platformPc: [false, Validators.required],
    })
  }

  insertOne() {

  }

}
