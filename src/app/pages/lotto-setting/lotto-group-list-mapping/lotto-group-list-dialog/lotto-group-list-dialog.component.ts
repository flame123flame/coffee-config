import { MessageService } from './../../../../service/message.service';
import { BeanService } from './../../../../service/BeanService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const URL = {
  SAVE_GROUP_LIST:'group-list/add',
  GET_ALL_GROUPLIST:'group-list/get-all',
  GET_ALL_LOTTO: 'lotto-class/get-all-lotto-class',
}
@Component({
  selector: 'app-lotto-group-list-dialog',
  templateUrl: './lotto-group-list-dialog.component.html',
  styleUrls: ['./lotto-group-list-dialog.component.scss']
})
export class LottoGroupListDialogComponent implements OnInit {

  id: number = null;
  formGroupList: FormGroup;
  lottoClassList = []
  lottoGroupList = []
  lottoClassFilter = []

  constructor(
    public dialogRef: MatDialogRef<LottoGroupListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private FormGroup: FormBuilder,
    private BeanService: BeanService,
  ) {
    console.log(data)
    data.data ? this.createForm(data.data.data) : this.createForm();
    this.getLottoClassList()
    this.getAllGroupList()
   }

  ngOnInit(): void {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(data = null) {
    console.log(data)
    if (data) {
      this.id = data.id;
      this.formGroupList = this.FormGroup.group({
        classCode: [data.classCode, Validators.required],
        groupListCode: [data.groupCode, Validators.required],
      });
    } else {
      this.formGroupList = this.FormGroup.group({
        classCode: [null, Validators.required],
        groupListCode: [null, Validators.required],
      });
    }
  }

  insertOne() {
    this.formGroupList.markAllAsTouched();
    if (this.formGroupList.invalid) return;
    this.BeanService.doPost(`${URL.SAVE_GROUP_LIST}/${this.formGroupList.controls.classCode.value}/${this.formGroupList.controls.groupListCode.value}`,'').subscribe(data => {
      this.onNoClick();
    });
  }

  getLottoClassList() {
    this.BeanService.doGet(`${URL.GET_ALL_LOTTO}`).subscribe(data => {
      if(data.status === MessageService.MSG.SUCCESS)
      {
        this.lottoClassList = data.data;
      }
    });
  }

  getAllGroupList()
  {
    this.BeanService.doGet(URL.GET_ALL_GROUPLIST).subscribe(res=>{
      if(res.status === MessageService.MSG.SUCCESS)
      {
        this.lottoGroupList = res.data
      }
    })
  }

  onSelectionChange()
  {
    this.lottoClassFilter = this.lottoClassList.filter(element=>{
      return !this.lottoGroupList.find(res=>
        res.classCode == element.lottoClassCode
      )
    })
    console.log(this.lottoClassFilter)
  }

}
