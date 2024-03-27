import { GameTagModel } from './../../../../models/respons-interface/GameTag';
import { MessageService } from './../../../../service/message.service';
import { BaseService } from './../../../../service/BaseService.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
const URL = {
  GET_ALL: 'game-tag/get-all-sort',
  SAVE_NEW_ORDER: 'game-tag/re-order'
};


@Component({
  selector: 'app-game-tag-order-edit-dialog',
  templateUrl: './game-tag-order-edit-dialog.component.html',
  styleUrls: ['./game-tag-order-edit-dialog.component.scss']
})
export class GameTagOrderEditDialogComponent implements OnInit {

  @ViewChild('table') table: MatTable<GameTagModel>;
  displayedColumns: string[] = ['position', 'code', 'name'];
  dataSource: GameTagModel[] = [];

  dropTable(event: CdkDragDrop<GameTagModel[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  constructor(public dialogRef: MatDialogRef<GameTagOrderEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private baseSer: BaseService) {
    this.getAll();
  }

  ngOnInit(): void {

  }

  getAll() {
    this.baseSer.doGet(URL.GET_ALL).subscribe((res) => {
      if (res.status === MessageService.MSG.SUCCESS) {
        this.dataSource = res.data;
      }
    });


  }

  save() {
    let len = this.dataSource.length + 1;
    let data = this.dataSource.map(ele => {
      len = len - 1;
      return { id: ele.id, priority: len };
    });
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.baseSer.doPost(URL.SAVE_NEW_ORDER, data).subscribe(res => {
        if (res.status == MessageService.MSG.SUCCESS) {
          this.dialogRef.close();
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      })
    });
  }

}
