import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-withdrawal-list-remark-dialog',
  templateUrl: './withdrawal-list-remark-dialog.component.html',
  styleUrls: ['./withdrawal-list-remark-dialog.component.scss']
})
export class WithdrawalListRemarkDialogComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'status',
    'rtp',
    'exclude'];

  dataInput = [];

  closeResult = [];

  remark : string = null;

  constructor(
    public dialogRef: MatDialogRef<WithdrawalListRemarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private baseSer: BaseService
    ) { }

  onNoClick(str:string): void {
    this.dialogRef.close({status:str,data:this.remark});
  }

  onSave(){
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.onNoClick("SUCCESS");
    });
  }

  ngOnInit() {
   console.log(this.data)
  }
}
