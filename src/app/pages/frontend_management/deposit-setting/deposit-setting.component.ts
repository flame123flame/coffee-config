import { MessageService } from 'src/app/service/message.service';
import { DialogSweetAlertService } from '../../../service/DialogSweetAlert.service';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/service/BaseService.service';
import { FormBuilder, FormGroup } from '@angular/forms';
const URL = {
  SAVE_DEPOSIT_SETTIN: 'deposit-setting/save-deposit-setting',
  GET_DEPOSIT_SETTIN: 'deposit-setting/get-deposit-setting',
};
@Component({
  selector: 'app-deposit-setting',
  templateUrl: './deposit-setting.component.html',
  styleUrls: ['./deposit-setting.component.scss'],
})
export class DepositSettingComponent implements OnInit {
  form: FormGroup;
  checkTransfer = true;
  constructor(private httpService: BaseService, private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null],
      checkTransfer: ['AUTO'],
    });
  }

  ngOnInit(): void {
    this.getCompanySettin();
  }

  save() {
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.httpService.doPost('', {}).subscribe((res) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess(
              '',
              res.message
            );
            this.getCompanySettin();
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        });
      }
    );
  }
  getCompanySettin() {
    this.httpService.doGet(URL.GET_DEPOSIT_SETTIN).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.form.patchValue({
          id: res.data.id,
          checkTransfer: res.data.moneyTransfer,
        });
      } else {
        DialogSweetAlertService.opentModalSweetAlertError('', res.message);
      }
    });
  }
}
