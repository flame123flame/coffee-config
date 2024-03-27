import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

class childGame {
  name: String = null
  status: boolean = null
  rtp: number = null
  isExclude: boolean = false
}

@Component({
  selector: 'app-cashback-setting-new-add-dialog',
  templateUrl: './cashback-setting-new-add-dialog.component.html',
  styleUrls: ['./cashback-setting-new-add-dialog.component.scss']
})
export class CashbackSettingNewAddDialogComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'status',
    'rtp',
    'exclude'];

  dataInput = [];

  closeResult = [];

  constructor(
    public dialogRef: MatDialogRef<CashbackSettingNewAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close(this.dataInput);
  }


  ngOnInit() {
    this.dataInput = this.data.games
  }

}
