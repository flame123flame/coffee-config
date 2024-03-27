import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BeanService } from 'src/app/service/BeanService.service';

@Component({
  selector: 'app-lotto-config-dialog-confirm',
  templateUrl: './lotto-config-dialog-confirm.component.html',
  styleUrls: ['./lotto-config-dialog-confirm.component.scss']
})
export class LottoConfigDialogConfirmComponent implements OnInit {
  lottoGroupCode = '';
  confirmStatus = '';
  topic = '';
  content = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<LottoConfigDialogConfirmComponent>,
    private httpBeanService: BeanService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    // this.lottoGroupCode = this.data;
    this.confirmStatus = this.data['status'];
    // if(this.data['content']){
    this.content = this.data['content'];
    this.topic = this.data['topic'];
    // }
    console.log(this.data);
  }

  Confirm() {
    console.log(this.data);
    // this.router.navigate(['lotto-settings/lotto-government/lotto-config/'],
    //   { queryParams: { classCode: this.lottoClassCode, groupCode: null, className: this.title } }
    // );
    // if (this.data['status'] == 'DELETE') {
    //   this.httpBeanService.doDelete('group-risk/delete-group-risk/' + this.data['data']).subscribe(res => {
    //     console.log(res);
    //   });
    // }
    // else if (this.data['status'] == 'SAVE') {
    //   this.httpBeanService.doPost('group-risk/add-group-risk', this.data['data']).subscribe(res => {
    //     console.log(res);
    //   });
    // }
  }

}
