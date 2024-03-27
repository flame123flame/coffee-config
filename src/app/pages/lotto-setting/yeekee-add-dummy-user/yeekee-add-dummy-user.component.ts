import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';

const URL = {
  GET_CUSTOMER_DUMY: 'CustomerDumy/get-all-cuctomer-dumy',
  GET_CUSTOMER: 'customer/check-user-dummy/',
  SAVE_DUMMY_ON_CUSTOMER: 'customer/save-user-dummy-on-customer',
  UPDATE_CUSTOMER_DUMY: '',
  SAVE_CUSTOMER_DUMY: 'CustomerDumy/save-customer-dumy',
  DELETE_CUSTOMER_DUMY: 'CustomerDumy/delete-by-code/',
  DELETE_CUSTOMER_DUMY_ON_CUSTOMER: 'customer/delete-user-dummy-on-customer-by-username/',
  
}
@Component({
  selector: 'app-yeekee-add-dummy-user',
  templateUrl: './yeekee-add-dummy-user.component.html',
  styleUrls: ['./yeekee-add-dummy-user.component.scss']
})
export class YeekeeAddDummyUserComponent implements OnInit {
  lottoClassCode: any;
  className: any;
  formAddDummy:FormGroup
  columns = [
    { header: 'User Dummy', field: 'username' },
    { header: 'Created By',field:'createdBy'},
    { header: 'Created Date',field:'createdDate',type:'dateFormat'},
    { header: 'Code', field: 'dumyCode' }
  ];
  tr: any = [
    'no',
    'username',
    'createdBy',
    'createdDate',
    'action',
  ];

  actionSetting: ActionSetting = new ActionSetting({
    hideEdit: false
  });

  dummyUserList = [];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private httpBaseService: BaseService,
    private formBuilder: FormBuilder,
  ) {
    routeParam.queryParams.subscribe(param => {
      this.lottoClassCode = param.lottoClassCode;
      this.className = param.className;
    });
  }

  ngOnInit(): void {
    this.getDummy();
    this.setFromAddDummy();
  }

  setFromAddDummy() {
    this.formAddDummy = this.formBuilder.group({
      dummyName: ['', [Validators.required,Validators.minLength(8)]],
    });
  }

  getDummy() {
    this.httpBeanService.doGet(URL.GET_CUSTOMER_DUMY).subscribe(res => {
      console.log(res.data);
      if (res.status == 'SUCCESS') {
        this.dummyUserList = res.data;
      }
    });
  }

  addRow() {
    console.log(this.formAddDummy.value)
    /** check form */
    const controls = this.formAddDummy.controls;
    if (this.formAddDummy.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }

    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.httpBaseService.doGet(URL.GET_CUSTOMER + this.formAddDummy.value.dummyName.trim()).subscribe(res => {
        if (!res.data) {
          this.httpBeanService.doPost(URL.SAVE_CUSTOMER_DUMY, { username: this.formAddDummy.value.dummyName.trim() }).subscribe(res => {
            if (res.status == 'SUCCESS') {
              this.dummyUserList = [];
              this.setFromAddDummy();
              this.getDummy();
            }
          });
          this.httpBaseService.doPost(URL.SAVE_DUMMY_ON_CUSTOMER,
            { mark: "dummy", username: this.formAddDummy.value.dummyName.trim(), mobilePhone: ""}
          ).subscribe(res => { });
  
        } else {

        }
      });
    });

  }

  onSave() {

  }

  goBack() {
    this.router.navigate(['lotto-settings/lotto-yeekee']);
  }


  deleteOne(dummyCode, username) {
    console.log("DELETE:" + dummyCode);
    this.httpBeanService.doDelete(URL.DELETE_CUSTOMER_DUMY + dummyCode).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.httpBaseService.doDelete(URL.DELETE_CUSTOMER_DUMY_ON_CUSTOMER + username).subscribe(res => {
          if (res.status == 'SUCCESS') {
            this.getDummy();
          }
        });
      }
    });
  }
}
