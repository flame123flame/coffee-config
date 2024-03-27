import { GameTagMappingGameModel } from './../../../../models/respons-interface/GameTagMappingGame';
import { GamesModel } from './../../../../models/respons-interface/Games';
import { RequestRespond } from './../../../../models/RequestRespond';
import { BaseService } from 'src/app/service/BaseService.service';
import { GameTagModel } from './../../../../models/respons-interface/GameTag';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  GET_ALL_SELECTED: 'game-tag-mapping-game/get-by-game-tag-code',
  GET_ALL_GAMES: 'games/get-all-games-no-icon',
  SAVE_DIRECT: 'game-tag-mapping-game',
}
@Component({
  selector: 'app-game-tag-add-game-dialog',
  templateUrl: './game-tag-add-game-dialog.component.html',
  styleUrls: ['./game-tag-add-game-dialog.component.scss']
})
export class GameTagAddGameDialogComponent implements OnInit {

  dataTableNotSelect: GamesModel[] = [];
  dataTableSelect: GamesModel[] = [];

  displayedColumns: string[] = ['select', 'displayName'];
  dataSource = new MatTableDataSource<any>(this.dataTableNotSelect);
  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  dataSource2 = new MatTableDataSource<any>(this.dataTableSelect);
  selection2 = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle2() {
    this.isAllSelected2() ?
      this.selection2.clear() :
      this.dataSource2.data.forEach(row => this.selection2.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel2(row?: any): string {
    if (!row) {
      return `${this.isAllSelected2() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection2.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  constructor(public dialogRef: MatDialogRef<GameTagAddGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GameTagModel,
    private baseSer: BaseService) {
    this.getAllSelectedGames()
  }

  ngOnInit(): void {
  }


  getAllSelectedGames() {
    this.baseSer.doGet(`${URL.GET_ALL_SELECTED}/${this.data.code}`).subscribe((resGamesTag: RequestRespond<GameTagMappingGameModel[]>) => {
      this.baseSer.doGet(URL.GET_ALL_GAMES).subscribe((resGames: RequestRespond<GamesModel[]>) => {
        let fillter = resGamesTag.data.map(ele => { return ele.gameCode })
        this.dataTableNotSelect = resGames.data.filter(ele => { return fillter.includes(ele.gameCode) ? false : true })
        this.dataTableSelect = resGames.data.filter(ele => { return fillter.includes(ele.gameCode) ? true : false })
        this.dataSource = new MatTableDataSource<any>(this.dataTableNotSelect);
        this.dataSource2 = new MatTableDataSource<any>(this.dataTableSelect);
        this.dataSource2.data.forEach(row => this.selection2.select(row));
      })
    })
  }



  saveMapping() {
    let data1 = this.selection.selected.map(ele => {
      return {
        gameTagCode: this.data.code,
        gameCode: ele.gameCode
      }
    })
    let data2 = this.selection2.selected.map(ele => {
      return {
        gameTagCode: this.data.code,
        gameCode: ele.gameCode
      }
    })
    let finalData = [...data1,...data2]
    this.baseSer.doPost(`${URL.SAVE_DIRECT}/${this.data.code}`,finalData).subscribe(res=>{
      if (res.status == MessageService.MSG.SUCCESS) {
        this.dialogRef.close()
        DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
      } else {
        this.dialogRef.close()
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    })
  }




}
