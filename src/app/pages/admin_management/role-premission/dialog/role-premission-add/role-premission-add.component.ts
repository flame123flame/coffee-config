import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import menu from 'src/app/config/menu';
import { PeriodicElement } from 'src/app/pages/casino_settings/product-maintenance/product-maintenance.component';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
const URL = {
  PAGINATE: "fw-user-role/paginate",
  MAIN: "fw-user",
  MAIN_ROLE: "fw-user-role"
}
@Component({
  selector: 'app-role-premission-add',
  templateUrl: './role-premission-add.component.html',
  styleUrls: ['./role-premission-add.component.scss']
})
export class RolePremissionAddComponent implements OnInit {
  menuList = menu;

  myTable = [];
    dataInput = [];

    tr: any = [
      'select',
      'display'
    ];
    selection = new SelectionModel<any>(true, []);

    form: FormGroup

    type : string = "ADD"
    id = null
    isSelectPage = true;

  constructor(
    public dialogRef: MatDialogRef<RolePremissionAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private baseSer: BaseService,
    private fb: FormBuilder,
    private cdr : ChangeDetectorRef) {
    this.createForm()
    if (data) {
      this.type = "EDIT"
      this.id = data
      this.getById(data);
    }
    this.createTable();
    this.selection.changed.subscribe(data=>{
      if (this.selection.selected.length != 0) {
        this.isSelectPage = true;
      }else{
        this.isSelectPage = false;

      }
    })
  }


  createTable(){
    let groupId = 0
    this.menuList.forEach(ele => {
      this.myTable.push({ display: ele.title, id: ele.id, header: true ,groupId:groupId})
      if (ele.children && ele.children.length != 0) {
        ele.children.forEach(data => {
          this.myTable.push({ display: data.title, id: data.id, header: false ,groupId:groupId})
        })
      }
    });
    this.dataInput = this.myTable
  }


  prepareData(){
    let body = this.form.value
    body.isDisable = !body.isDisable
    body.fwRoleMenuAccessReq = []
    console.log(this.selection.selected)
    this.selection.selected.forEach(element => {
      body.fwRoleMenuAccessReq.push({menuId : element.id})
    });
    console.log(body)
    return body
  }

  getById(id){
   this.baseSer.doGet(`${URL.MAIN_ROLE}/${id}`).subscribe(res=>{
    // this.createForm(res.data)
    this.form.controls.id.setValue(res.data.id);
    this.form.controls.name.setValue(res.data.name);
    this.form.controls.isDisable.setValue(res.data.isDisable);
    res.data.fwRoleMenuAccessRes.forEach(element => {
    let findItem = this.dataInput.find(x=>x.id == element.menuId);
    if(findItem)
    {
      this.selection.select(findItem)
    }
    });
    console.log("RolePremissionAddComponent -> getById -> this.selection.selected", this.selection.selected)
   });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataInput.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataInput.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }

  onSave() {
    console.log(this.form);
    if (this.selection.selected.length == 0) {
      this.isSelectPage = false;
      return
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    if (this.id) {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.baseSer.doPut(`${URL.MAIN_ROLE}/${this.id}`, this.prepareData()).subscribe(res => {
          if (MessageService.MSG.SUCCESS = res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.status);
            this.onNoClick()
            return

          }
          else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      });
      this.baseSer.doPut(`${URL.MAIN_ROLE}/${this.id}`, this.prepareData()).subscribe(res => {
       this.onNoClick()
        return
      })
    } else {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.baseSer.doPost(URL.MAIN_ROLE, this.prepareData()).subscribe(res => {
          if (MessageService.MSG.SUCCESS = res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.status);
            this.onNoClick()
          }
          else {
            if (res.message == "Duplicate Name") {
              this.form.controls.name.setErrors({duplicateName : this.form.controls.name.value});
            }
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      });
    }
  }

  createForm() {
      this.form = this.fb.group({
        id: [null],
        name: [null, Validators.required],
        isDisable: [true, Validators.required],
      })
  }
}
