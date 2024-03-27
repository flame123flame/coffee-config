import { group } from '@angular/animations';
import { MessageService } from './../../../service/message.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from 'src/app/service/BaseService.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ColumnTable } from 'src/app/models/ColumnTable';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
const URL = {
  GET_BY_CODE: 'groupLevel/getGroupLevelByGroupCode/',
  GET_PROMOTION: 'promotion/get-promotion-by-groupcode/',
};
@Component({
  selector: 'app-group-level-add-new-group',
  templateUrl: './group-level-add-new-group.component.html',
  styleUrls: ['./group-level-add-new-group.component.scss'],
})
export class GroupLevelAddNewGroupComponent implements OnInit {
  code: any = null;
  fileName = '';
  file = '';
  tmp: any = '';
  viewDetail: boolean;
  formAddGroupLv: FormGroup;
  columns = [
    { header: 'Promotion Title', field: 'promoTitle' },
    { header: 'Promotion Type', field: 'promoType' },
    { header: 'Promotion Wallet', field: 'wallet' },
    { header: 'Promotion PeriodType', field: 'promoPeriodType' },
  ];
  tr = ['promoTitle', 'promoType', 'wallet', 'promoPeriodType'];
  dataInput = [];
  constructor(
    private router: Router,
    private httpService: BaseService,
    private avtivateRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.formAddGroupLv = this.formBuilder.group({
      groupName: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      status: new FormControl(
        { value: 'Active', disabled: false },
        Validators.required
      ),
      description: new FormControl({ value: null, disabled: false }),
      defaultGroup: new FormControl({ value: false, disabled: false }),
      dailyMaxWDAmount: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      dailyMaxWDCount: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      maxDepositAmt: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      minDepositAmt: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      maxWithdrawalAmt: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      minWithdrawalAmt: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      groupCode: new FormControl({ value: null, disabled: false }),
      groupMobilePhone: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      // groupMobilePhone: [null, [Validators.required,Validators.pattern("^[0][1-9]{1}[0-9]{8}$")]],
      groupLinkLine: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      groupIconImg: new FormControl({ value: null, disabled: false }),
      generalCondition: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      level: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
    });
  }

  ngOnInit(): void {
    const code = this.avtivateRoute.snapshot.queryParams['groupCode'];
    this.viewDetail =
      this.avtivateRoute.snapshot.queryParams['viewDetail'] === 'true';
    console.log('viewDetail>>> ' + this.viewDetail);

    if (code != null) {
      this.getByCode(code);
      this.getPromoByGroupCode(code);
      this.code = code;
    }

    if (this.viewDetail) {
      console.log('if');
      this.formAddGroupLv.controls.groupName.disable();
      this.formAddGroupLv.controls.status.disable();
      this.formAddGroupLv.controls.description.disable();
      this.formAddGroupLv.controls.defaultGroup.disable();
      this.formAddGroupLv.controls.dailyMaxWDAmount.disable();
      this.formAddGroupLv.controls.dailyMaxWDCount.disable();
      this.formAddGroupLv.controls.maxDepositAmt.disable();
      this.formAddGroupLv.controls.minDepositAmt.disable();
      this.formAddGroupLv.controls.maxWithdrawalAmt.disable();
      this.formAddGroupLv.controls.minWithdrawalAmt.disable();
      this.formAddGroupLv.controls.groupCode.disable();
      this.formAddGroupLv.controls.groupMobilePhone.disable();
      this.formAddGroupLv.controls.groupLinkLine.disable();
      this.formAddGroupLv.controls.groupIconImg.disable();
      this.formAddGroupLv.controls.generalCondition.disable();
      this.formAddGroupLv.controls.level.disable();
    } else {
      console.log('else');
      this.formAddGroupLv.controls.groupName.enable();
      this.formAddGroupLv.controls.status.enable();
      this.formAddGroupLv.controls.description.enable();
      this.formAddGroupLv.controls.defaultGroup.enable();
      this.formAddGroupLv.controls.dailyMaxWDAmount.enable();
      this.formAddGroupLv.controls.dailyMaxWDCount.enable();
      this.formAddGroupLv.controls.maxDepositAmt.enable();
      this.formAddGroupLv.controls.minDepositAmt.enable();
      this.formAddGroupLv.controls.maxWithdrawalAmt.enable();
      this.formAddGroupLv.controls.minWithdrawalAmt.enable();
      this.formAddGroupLv.controls.groupCode.enable();
      this.formAddGroupLv.controls.groupMobilePhone.enable();
      this.formAddGroupLv.controls.groupLinkLine.enable();
      this.formAddGroupLv.controls.groupIconImg.enable();
      this.formAddGroupLv.controls.generalCondition.enable();
      this.formAddGroupLv.controls.level.enable();
    }
  }
  getByCode(code) {
    this.httpService.doGet(URL.GET_BY_CODE + code).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formAddGroupLv.patchValue({
          groupCode: res.data.groupCode,
          groupName: res.data.groupName,
          status: res.data.status,
          description: res.data.description,
          defaultGroup: res.data.defaultGroup,
          dailyMaxWDAmount: res.data.dailyMaxWDAmount,
          dailyMaxWDCount: res.data.dailyMaxWDCount,
          maxDepositAmt: res.data.maxDepositAmt,
          minDepositAmt: res.data.minDepositAmt,
          maxWithdrawalAmt: res.data.maxWithdrawalAmt,
          minWithdrawalAmt: res.data.minWithdrawalAmt,
          groupMobilePhone: res.data.groupMobilePhone,
          groupLinkLine: res.data.groupLinkLine,
          generalCondition: res.data.generalCondition,
          level: res.data.level,
          groupIconImg: res.data.groupIconImg,
        });
        this.tmp = res.data.groupIconImg;

        console.log(this.formAddGroupLv);
      }
    });
  }

  getPromoByGroupCode(code) {
    this.httpService.doGet(URL.GET_PROMOTION + code).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataInput = res.data;
      }
    });
  }

  onSubmit() {
    // console.log(this.formAddGroupLv.value);
    if (this.formAddGroupLv.status == 'VALID') {
      if (this.code == null) {
        console.log(this.formAddGroupLv.value);
        this.formAddGroupLv.value.groupIconImg = this.tmp;
        this.httpService
          .doPost('groupLevel/saveNewGroupLevel', this.formAddGroupLv.value)
          .subscribe((data) => {
            if (MessageService.MSG.SUCCESS == data.status) {
              alert(data.status);
              this.router.navigate(['player-management/group-level']);
            }
          });
      } else {
        console.log(this.formAddGroupLv.value);
        this.formAddGroupLv.value.groupIconImg = this.tmp;
        this.httpService
          .doPut('groupLevel/editGroupLevel', this.formAddGroupLv.value)
          .subscribe((data) => {
            if (MessageService.MSG.SUCCESS == data.status) {
              alert(data.status);
              this.router.navigate(['player-management/group-level']);
            }
          });
      }
    }
  }

  onToggleShowInFrontEnd(data) {
    console.log(data.value);
    // console.log(this.formAddGroupLv.value.defaultGroup);
  }
  onCancel() {
    this.router.navigate(['player-management/group-level']);
  }

  preview(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    const sizeFile = files[0].size;
    const mimeType = files[0].type;
    this.fileName = files[0].name;
    this.file = files[0];
    console.log(reader);

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      console.log(reader.result);
      this.tmp = reader.result;
    };
  }
}
