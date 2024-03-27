import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BeanService } from 'src/app/service/BeanService.service';
import { LottoConstants } from '../lotto-constants/lotto-constants';
const URL = {
  GET_LOTTO_CATEGORY: 'lotto-list/lotto-category-list',
  GET_LOTTO_CLASS_BY_CATEGORY: 'lotto-class/get-lotto-class/',
  GET_INSTALLMENT_ON_LOTTO_TRANSACTION: 'lotto-transaction/get-lotto-transaction-by-class-code/',
  GET_ROUND_ON_SUBMIT: 'lotto-transaction/get-yeekee-round-by-installment',
  CANCEL_LOTTO_TRANSACTION: 'lotto-transaction/lotto-cancel-update-transaction',
}

@Component({
  selector: 'app-lotto-cancel',
  templateUrl: './lotto-cancel.component.html',
  styleUrls: ['./lotto-cancel.component.scss']
})
export class LottoCancelComponent implements OnInit {
  selected1 = '';
  selected2 = '';

  lottoClassList = [];
  installmentList = [];
  roundList = [];
  lottoCategoryList = [
    { lottoCategoryCode: LottoConstants.LOTTO_GOVERNMENT, lottoCategoryName: 'หวยรฐับาล' },
    { lottoCategoryCode: LottoConstants.LOTTO_STOCK, lottoCategoryName: 'หวยหุ้น' },
    { lottoCategoryCode: LottoConstants.LOTTO_YEEKEE, lottoCategoryName: 'หวยยี่กี' }
  ];
  model = {
    lottoCategory: '',
    lottoClass: '',
    installment: '',
    round: '',
  }
  form: FormGroup;
  constructor(
    private beanSer: BeanService,
    public dialog: MatDialog,
    private httpBean: BeanService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      // lottoCategoryCode: [null, Validators.required],
      // lottoClassCode: [null, Validators.required],
      // installment: [null, Validators.required],
      // round: [0, Validators.required],
      // remark: [null, Validators.required],

      lottoCategoryCode: [null, Validators.required],
      lottoClassCode: [null, Validators.required],
      installment: [null, Validators.required],
      round: null,
      remark: [null, Validators.required],
    });
  }

  getLottoClass(event) {
    this.lottoClassList = [];
    this.installmentList = [];
    this.roundList = [];
    console.log(event.value);
    this.httpBean.doGet(URL.GET_LOTTO_CLASS_BY_CATEGORY + event.value).subscribe(res => {
      console.log("GET_LOTTO_CLASS_BY_CATEGORY", res.data);
      if (res.status == 'SUCCESS') {
        this.lottoClassList = res.data;
        if (event.value == LottoConstants.LOTTO_YEEKEE) {
          this.form.get('installment').setValue(null);
          this.form.get('round').setValue(null);

          this.form.get('lottoCategoryCode').setValidators([Validators.required]);
          this.form.get('lottoClassCode').setValidators([Validators.required]);
          this.form.get('installment').setValidators([Validators.required]);
          this.form.get('round').setValidators([Validators.required]);
          this.form.get('remark').setValidators([Validators.required]);
          this.form.updateValueAndValidity();
          console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   IF YEEKEE", this.form);
        }
        else {
          this.form.get('installment').setValue(null);
          this.form.get('round').setValue(null);

          this.form.get('lottoCategoryCode').setValidators([Validators.required]);
          this.form.get('lottoClassCode').setValidators([Validators.required]);
          this.form.get('installment').setValidators([Validators.required]);
          this.form.get('remark').setValidators([Validators.required]);
          this.form.get('round').clearValidators();
          this.form.updateValueAndValidity();
          console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   IF OTHER", this.form);
        }
        console.log("(ノಠ益ಠ)ノ彡┻━┻ ᕙ(⇀‸↼‶)ᕗ   last checking", this.form);
      }
    });
  }
  getInstallment(event) {
    this.roundList = [];
    this.httpBean.doGet(URL.GET_INSTALLMENT_ON_LOTTO_TRANSACTION + event.value).subscribe(res => {
      console.log("GET_INSTALLMENT_ON_LOTTO_TRANSACTION", res.data);
      if (res.status == 'SUCCESS') {
        this.installmentList = res.data;
        this.form.get('installment').setValue(null);
        this.form.get('round').setValue(null);
      }
    });
  }

  getRound(event) {
    this.httpBean.doGet(`${URL.GET_ROUND_ON_SUBMIT}?installment=${event.value}&lottoClassCode=${this.form.value.lottoClassCode}`).subscribe(res => {
      console.log("GET_ROUND_ON_SUBMIT", res.data);
      if (res.status == 'SUCCESS') {
        this.roundList = res.data;
      }
    });
  }

  saveData() {
    // console.log("SAVEEEEEEEE");
    console.log(this.form);
    if (this.form.status == 'VALID') {
      this.httpBean.doGet(`${URL.CANCEL_LOTTO_TRANSACTION}?categoryCode=${this.form.value.lottoCategoryCode}&classCode=${this.form.value.lottoClassCode}&installment=${this.form.value.installment}&roundYeekee=${this.form.value.round}&cancelRemark=${this.form.value.remark}`).subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.roundList = res.data;
          this.reset();
          this.createForm();
        }
      });
    }

  }

  reset() {
    // console.log("REEEEESET");
    this.form.reset();
  }

  checkYeekee() {
    if (this.form.get('lottoCategoryCode').value == LottoConstants.LOTTO_YEEKEE) {
      return true;
    }
    else {
      return false;
    }
  }

}
