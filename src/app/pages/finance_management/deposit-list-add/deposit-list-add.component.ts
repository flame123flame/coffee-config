import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/service/BaseService.service';

@Component({
  selector: 'app-deposit-list-add',
  templateUrl: './deposit-list-add.component.html',
  styleUrls: ['./deposit-list-add.component.scss'],
})
export class DepositListAddComponent implements OnInit {
  playerIDOption: [{ key: ''; value: '' }];
  depositBankOption: [{ key: ''; value: '' }];
  depositTypeOption: [{ key: ''; value: '' }];
  companyAccountOption: [{ key: ''; value: '' }];

  formModel = {
    depositOrder: '',
    username: '',
    companyAccountId: '',
    depositType: '',
    amount: '',
    remark: '',
    slip: 'Base64',
  };
  constructor(private baseService: BaseService) {}

  ngOnInit(): void {}
  onSubmit() {
    this.baseService.doPost('', this.formModel).subscribe((data) => {});
  }
}
