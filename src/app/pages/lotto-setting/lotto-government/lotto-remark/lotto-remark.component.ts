import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './lotto-remark.component.html',
  styleUrls: ['./lotto-remark.component.scss']
})
export class LottoRemarkComponent implements OnInit {
  remark;

  constructor(
    public dialogRef: MatDialogRef<LottoRemarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (!this.data) return;
    this.dialogRef.close(this.remark);
  }

}
