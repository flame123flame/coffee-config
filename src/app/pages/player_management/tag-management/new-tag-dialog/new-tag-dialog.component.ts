import { BaseService } from 'src/app/service/BaseService.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
const URL = {
  DEFAULT : 'tag-management',
  PAGINATE : 'tag-management/paginate',
}
class TagManagementReq {
  id?: number
  name: string
  description: string
  remark: string
  totalPlayers: number
}
@Component({
  selector: 'app-new-tag-dialog',
  templateUrl: './new-tag-dialog.component.html',
  styleUrls: ['./new-tag-dialog.component.scss']
})
export class NewTagDialogComponent implements OnInit {

  formAddTag: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private tagSer: BaseService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createFrom(data = undefined) {
    this.formAddTag = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      remark: [null]
    });
    if (data) {
      this.formAddTag = this.fb.group({
        name: [data.name, Validators.required],
        description: [data.description, Validators.required],
        remark: [data.remark]
      });
    }
  }

  ngOnInit() {
    this.createFrom(this.data)
  }

  insertOne() {
    let data: TagManagementReq = new TagManagementReq()
    data.description = this.formAddTag.controls.description.value
    data.name = this.formAddTag.controls.name.value
    data.remark = this.formAddTag.controls.remark.value
    data.totalPlayers = 0

    if (this.data) {
      data.id = this.data['id']
      this.tagSer.doPut(URL.DEFAULT,data).subscribe(data=>{
        this.onNoClick();
      })
    }else{
      this.tagSer.doPost(URL.DEFAULT,data).subscribe(data => {
        this.onNoClick();
      })
    }
  }

}
