import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTagDialogComponent } from 'src/app/pages/player_management/tag-management/new-tag-dialog/new-tag-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/service/BaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bank-dialog',
  templateUrl: './add-bank-dialog.component.html',
  styleUrls: ['./add-bank-dialog.component.scss']
})
export class AddBankDialogComponent implements OnInit {

  tmp: any = "";
  id: any = null;
  isHotBank: boolean = false
  formBank: FormGroup;
  fileName = "";
  file = "";
  constructor(
    private router: Router,
    private httpService: BaseService,
    public dialogRef: MatDialogRef<NewTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
    this.formBank = this.formBuilder.group({
      id: [''],
      bankCode: ['', Validators.required],
      bankNameTh: ['', Validators.required],
      bankNameEn: ['', Validators.required],
      bankUrl: ['', Validators.required],
      bankImg: ['', Validators.required],
      enable: [false, Validators.required],
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.createFrom(this.data)
  }


  createFrom(data = undefined) {
    console.log(data);
    if (data != null) {
      this.id = data.id;
      this.formBank = this.formBuilder.group({
        id: data.id,
        bankCode: data.bankCode,
        bankNameTh: [data.displayName, Validators.required],
        bankNameEn: [data.bankName, Validators.required],
        bankUrl: [data.bankUrl.url, Validators.required],
        bankImg: [data.bankImg, Validators.required],
        enable: [data.hot == 'ON' ? true : false, Validators.required],
      })
    }

  }

  onSave() {
    if (this.id == null) {
      this.formBank.value.bankImg = this.tmp;
      this.httpService.doPost("bank/save-bank", this.formBank.value).subscribe(data => {
        this.onNoClick();
      });
    }
    else {
      console.log(this.formBank.value);
      this.formBank.value.bankImg = this.tmp;
      this.httpService.doPut("bank/edit-bank", this.formBank.value).subscribe(data => {
        this.onNoClick();
      });
    }

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

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      console.log(reader.result);
      this.tmp = reader.result;
    };
  }
}
