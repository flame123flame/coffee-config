import { MessageService } from './../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { url } from 'inspector';
import { ValidatorFn } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
const URL = {
  GET: "affiliate-setting/get-affiliate-setting",
  SAVE: "affiliate-setting/save-affiliate-setting"
}
@Component({
  selector: 'app-affiliate-bonus-setting',
  templateUrl: './affiliate-bonus-setting.component.html',
  styleUrls: ['./affiliate-bonus-setting.component.scss']
})
export class AffiliateBonusSettingComponent implements OnInit {
  formGroupAffiliate: FormGroup;
  constructor(private router: Router,
    private httpService: BaseService,
    private formBuilder: FormBuilder,) {
    this.formGroupAffiliate = this.formBuilder.group({
      id: [null],
      showPage: [false],
      applyType: [null],
      enableOnetime: [false],
      minDepositStatus: [false],
      minDeposit: [null, [Validators.min(0), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      minValidBetsStatus: [false],
      minValidBets: [null, [Validators.min(0), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      affiliateStatus: [false],
      affiliate: [null, [Validators.min(0), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      downlineStatus: [false],
      downline: [null, [Validators.min(0), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      enableCondStatus: [false],
      enableCond: [null, [Validators.min(1), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      adminFee: [null, [Validators.min(0), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      processingFee: [null, [Validators.min(0), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      desktop: [null],
      mobile: [null],
    })
  }

  ngOnInit(): void {
    this.getAffiliate();
  }

  saveFormAffiliate() {
    console.log(this.formGroupAffiliate);
    this.httpService.doPost(URL.SAVE, this.formGroupAffiliate.value).subscribe(res => {
      if (MessageService.MSG.SUCCESS = res.status) {
        alert(res.status);
      } else {
        alert(res.status);
      }
    })
  }

  getAffiliate() {
    this.httpService.doGet(URL.GET).subscribe(res => {
      if (MessageService.MSG.SUCCESS = res.status) {
        // if (res.data != null) {
        //   this.affiliateForm = res.data;
        // }
        res.data != null ? this.formGroupAffiliate.patchValue({
          id: res.data.id,
          showPage: res.data.showPage,
          applyType: res.data.applyType,
          enableOnetime: res.data.enableOnetime,
          minDepositStatus: res.data.minDepositStatus,
          minDeposit: res.data.minDeposit,
          minValidBetsStatus: res.data.minValidBetsStatus,
          minValidBets: res.data.minValidBets,
          affiliateStatus: res.data.affiliateStatus,
          affiliate: res.data.affiliate,
          downlineStatus: res.data.downlineStatus,
          downline: res.data.downline,
          enableCondStatus: res.data.enableCondStatus,
          enableCond: res.data.enableCond,
          adminFee: res.data.adminFee,
          processingFee: res.data.processingFee,
          desktop: res.data.desktop,
          mobile: res.data.mobile,
        }) : ''
      } else {

      }
    })
  }

  myValidator: ValidatorFn = (c) => {
    // any component logic here
    console.log(">>>>>>>>>", c.value);

    if (c.value != 'bob') {
      return { ['isBob']: true };
    }
  };

}
