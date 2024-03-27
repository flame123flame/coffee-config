import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PaginateRequest } from './../../models/PaginateRequest';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnTable } from '../../models/ColumnTable';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-table-mat',
  templateUrl: './table-mat.component.html',
  styleUrls: ['./table-mat.component.scss'],
})
export class TableMatComponent implements OnInit {
  @Output() @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() columns: Array<ColumnTable>;
  @Input() dataInput: Array<any> = [];
  @Input() displayedColumns: Array<String> = [];
  @Input() displayedSecondColumns: Array<String> = [];
  @Input() displayPaginator: boolean = true;
  @Input() pageSizeOptions: number[] = [25, 50, 100];
  @Input() pageSize: number = 25;
  @Input() length: number = 0;
  @Input() enableFooterRow: boolean = false;
  @Input() enableFooterRowSecond: boolean = false;
  @Output() deleteAction = new EventEmitter<any>();
  @Output() editAction = new EventEmitter<any>();
  @Output() detaileAction = new EventEmitter<any>();
  // @Output() toggleAction = this.paginator;
  @Output() toggleAction = new EventEmitter<any>();
  @Output() optionChange = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<any>();
  @Output() onSortChange = new EventEmitter<any>();

  @Input() actionSetting = new ActionSetting({
    type: 'default',
  });
  selection = new SelectionModel<any>(true, []);
  selected = '1';
  dataSource: MatTableDataSource<Object>;
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.dataInput && this.dataInput.length > 0) {
      this.dataSource = new MatTableDataSource<Object>(this.dataInput);
    } else {
      this.dataSource = new MatTableDataSource<Object>([]);
    }
  }
  castToDataSource(data) {
    let instantDataSource = new MatTableDataSource<Object>(data);
    instantDataSource.sort = this.sort;
    instantDataSource.paginator = this.paginator;
    this.dataSource = instantDataSource;
    return instantDataSource;
  }

  _deleteAction(data) {
    this.deleteAction.emit(data);
  }

  _editAction(data) {
    this.editAction.emit(data);
  }

  _detaileAction(data) {
    this.detaileAction.emit(data);
  }

  _toggleAction(data, row) {
    let res = {
      status: data,
      data: row,
    };
    this.toggleAction.emit(res);
  }

  _ButtonCheckRender(data: any = null, dataArr: any[] = []) {
    console.log(data);
    console.log(dataArr);

    if (!data) {
      return false;
    }
    let index = dataArr.findIndex((x) => x == data);
    if (index >= 0) {
      return true;
    }
    return false;
  }

  _log() {
    console.log(this.dataSource);
  }

  _optionChange(event) {
    this.optionChange.emit(event);
  }

  _pageChange(event) {
    this.onPageChange.emit(event);
  }

  _sortChange(event) {
    this.onSortChange.emit(event);
  }
}
