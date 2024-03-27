import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../service/message.service';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Location } from '@angular/common';
const URL = {
  SAVE: "customer/save-customer",
  GET_GROUP_LEVEL: "groupLevel/getAllGroupLevel",
  GET_DROPDOWN_BANK: "bank/get-bank-all",
}
@Component({
  selector: 'app-playerlist-new-player',
  templateUrl: './playerlist-new-player.component.html',
  styleUrls: ['./playerlist-new-player.component.scss']
})
export class PlayerlistNewPlayerComponent implements OnInit {
  // vipGroupOptions = [{ groupLevelId: 1, name: 'โบนัส 10% คาสิโน - โบนัส 10% คาสิโน' },
  // { groupLevelId: 2, name: 'โบนัส 100% คาสิโน - โบนัส 100% คาสิโน' }];
  vipGroupOptions = []
  bankList = []
  currencyOptions = [{ currencyId: '1', name: 'THB' }, { currencyId: '2', name: 'USD' }, { currencyId: '3', name: 'EUR' }];
  // flagMobileOptions = ['Thailand', 'United States', 'Russia'];
  formCustomer: FormGroup;
  constructor(private router: Router,
    private httpService: BaseService,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.formCustomer = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9]+$')]],
      realName: ['',],
      password: [null, Validators.required],
      // currencyId: ['', Validators.required],
      confirmPassword: [null, Validators.required],
      mobilePhone: ['', Validators.required],
      // email: ['', Validators.required],
      // country: ['', Validators.required],
      // city: ['', Validators.required],
      // birthday: ['', Validators.required],
      // internalPlayer: [false, Validators.required],
      // im1: ['', Validators.required],
      // im2: ['', Validators.required],
      groupCode: ['', Validators.required],
      bankCode: ['', Validators.required],
      bankAccount: ['', Validators.required]
    }, { validator: passwordMatchValidator })
  }
  hide1 = true
  hide2 = true
  ngOnInit(): void {
    this.getDropdownGroupLevel();
    this.getDropdownBank()
  }

  /* Shorthands for form controls (used from within template) */
  get password() { return this.formCustomer.get('password'); }
  get confirmPassword() { return this.formCustomer.get('confirmPassword'); }

  /* Called on each input in either password field */
  onPasswordInput() {
    if (this.formCustomer.hasError('passwordMismatch'))
      this.confirmPassword.setErrors([{ 'passwordMismatch': true }]);
    else
      this.confirmPassword.setErrors(null);
  }

  checkForm(valid) {
    if (valid) {
      this.saveFormCustomer()
    } else {

    }

  }

  saveFormCustomer() {
    console.log(this.formCustomer);
    console.log("formCustomer : ", this.formCustomer.value);
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
      this.httpService.doPost(URL.SAVE, this.formCustomer.value).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status && MessageService.SAVE.SUCCESS == res.message) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          this.location.back();
        } else if (MessageService.MSG.SUCCESS == res.status && MessageService.SAVE.DUPLICATE_USERNAME_DATA == res.message) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else if (MessageService.MSG.SUCCESS == res.status && MessageService.SAVE.DUPLICATE_MOBILE_DATA == res.message) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      });
    })

  }
  onClearForm() {
    this.formCustomer.patchValue({
      username: '',
      realName: '',
      password: '',
      confirmPassword: '',
      mobilePhone: '',
      groupCode: '',
      bankCode: '',
      bankAccount: '',
    });
  }

  getDropdownGroupLevel() {
    this.httpService.doGet(URL.GET_GROUP_LEVEL).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log(res.status);
        this.vipGroupOptions = res.data
      } else {
        console.log(res.status);

      }
    })
  }
  getDropdownBank() {
    this.httpService.doGet(URL.GET_DROPDOWN_BANK).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.bankList = res.data
      }
    })
  }

}
export const passwordMatchValidator: ValidatorFn = (formCustomer: FormGroup): ValidationErrors | null => {
  if (formCustomer.get('password').value === formCustomer.get('confirmPassword').value)
    return null;
  else
    return { passwordMismatch: true };
};
