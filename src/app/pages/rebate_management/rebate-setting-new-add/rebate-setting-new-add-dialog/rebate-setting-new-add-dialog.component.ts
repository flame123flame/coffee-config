import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
import { createDeflateRaw } from 'zlib';

class childGame {
  name: String = null
  status: boolean = null
  rtp: number = null
  isExclude: boolean = false
}

@Component({
  selector: 'app-rebate-setting-new-add-dialog',
  templateUrl: './rebate-setting-new-add-dialog.component.html',
  styleUrls: ['./rebate-setting-new-add-dialog.component.scss']
})
export class RebateSettingNewAddDialogComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'status',
    'rtp',
    'exclude'];


  dataInput = [];

  closeResult = [];

  constructor(
    public dialogRef: MatDialogRef<RebateSettingNewAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close(this.dataInput);
  }


  ngOnInit() {
    this.dataInput = this.data.games
  }


}
