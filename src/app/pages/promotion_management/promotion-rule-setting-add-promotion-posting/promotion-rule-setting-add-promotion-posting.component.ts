import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FileNameConstant } from 'src/app/constant/filename.constant';
import { BaseService } from 'src/app/service/BaseService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
import { Location } from '@angular/common';
import { PromotionRuleSettingReviewDialogComponent } from '../promotion-rule-setting-review-dialog/promotion-rule-setting-review-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PromotionDetailModel } from 'src/app/models/respons-interface/PromotionDetail';
interface Promotion {
  id: number;
  promoCode: string;
  promoType: string;
  promoTitle: string;
  appPlatform: string;
  promoPeriodType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  viewStatus: string;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
}

interface PostSetting {
  id: number;
  promoCode: string;
  ecPromotionTitle: string;
  lang: string;
  deskBanner: string;
  deskGrid?: any;
  deskDetail: string;
  mobileBanner?: any;
  mobileGrid?: any;
  mobileDetail?: any;
  mobileAppBanner?: any;
  mobileAppDetail?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
}

interface IssueSetting {
  id: number;
  promoCode: string;
  providerName: string;
}

interface AppSetting {
  id: number;
  promoCode: string;
  validPeriod: number;
  verificationType: string;
  depositSequence?: any;
  limitation?: any;
  repeatLimit?: any;
  allowApp: string;
  groupList?: any;
  notAllowTag: string;
  riskOptions?: any;
  violationSetting?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
  timeGapLimitationEnable?: boolean;
  timeGapLimitationValue?: number;
  timeGapLimitationType?: string;
  violationCountSetting?: number;
  sameRealName?: boolean;
  sameIP?: boolean;
}

interface RuleSetting {
  id: number;
  promoCode: string;
  selfSelectMode: string;
  bonusType: string;
  conditionType: string;
  singleBonusLimit?: any;
  maxApprovalLimit: number;
  maxApprovalLimitType: number;
  maxBonusLimit: number;
  depositAmt?: any;
  receiveBonusWallet?: any;
  bonusCalculation: number;
  withdrawCondition: number;
  conditionRemoval?: any;
  bonusRecycle?: any;
  productType?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
  maxBonusLimitType?: any;
  removeGeneral?: string;
  amountLimitType: string;
  amountLimit: number;
}
interface BonusLevelSetting {
  id?: number;
  promoCode?: string;
  bonusLevel?: number;
  depositAmount?: number;
  bonusCalculation?: number;
  withdrawCondition?: number;
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: any;
  updatedDate?: any;
}

interface DialogReqData {
  promotion: Promotion;
  postSetting: PostSetting;
  appSetting: AppSetting;
  ruleSetting: RuleSetting;
  issueSetting: IssueSetting[];
  bonusLevelSettings: BonusLevelSetting[];
}

@Component({
  selector: 'app-promotion-rule-setting-add-promotion-posting',
  templateUrl: './promotion-rule-setting-add-promotion-posting.component.html',
  styleUrls: ['./promotion-rule-setting-add-promotion-posting.component.scss'],
})
export class PromotionRuleSettingAddPromotionPostingComponent
  implements OnInit {
  firstFormGroup: FormGroup;
  postSettingFG: FormGroup;
  showError = false;
  fileNameAccept = FileNameConstant.uploadFile;
  operation = null;
  promoCode = null;
  constructor(
    private formBuilder: FormBuilder,
    private httpCli: BaseService,
    private location: Location,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.queryParams.subscribe((param) => {
      if (param.op) {
        this.operation = param.op;
        if (param.op == 'EDIT') {
          this.setDisabledForm();
        }
      }
      if (param.promoCode) {
        this.promoCode = param.promoCode;
        this.createForm(true);
        this.getPromoDetail(param.promoCode);
      } else {
        this.createForm();
      }
    });
  }

  ngOnInit(): void { }

  createForm(setEmptyString = false) {
    this.firstFormGroup = this.formBuilder.group({
      promoTitle: new FormControl(null, Validators.required),
      promoType: ['Posting'],
      appPlatform: new FormControl(
        { value: 'All', disabled: false },
        Validators.required
      ),
      promoPeriodType: new FormControl(
        { value: 'Indefinite', disabled: false },
        Validators.required
      ),
      startDate: new FormControl(new Date(), Validators.required),
      endDate: new FormControl(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        Validators.required
      ),
    });

    this.postSettingFG = this.formBuilder.group({
      lang: new FormControl({ value: 'TH', disabled: false }),
      deskBanner: new FormControl(null, Validators.required),
      deskGrid: new FormControl(null),
      deskDetail: new FormControl(null, Validators.required),
      mobileBanner: new FormControl(null),
      mobileGrid: new FormControl(null),
      mobileDetail: new FormControl(null),
      mobileAppBanner: new FormControl(null),
      mobileAppDetail: new FormControl(null),
    });
  }

  onSelectFile(event, control) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size >= 104857600) {
        // log
      }
      const reader = new FileReader();
      reader.onload = (onload: any) => {
        this.postSettingFG.get(control).patchValue(onload.target.result);
      };
      console.log(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  changeDateType() {
    if (this.firstFormGroup.value.promoPeriodType === 'DatePeriod') {
      this.firstFormGroup.get('endDate').setValidators(Validators.required);
    }
  }

  onChange($event) {
    this.postSettingFG.get('deskDetail').patchValue($event);
  }

  onSave() {
    console.log(this.postSettingFG.value);
    console.log(this.firstFormGroup.value);
    this.showError = true;
    this.firstFormGroup.markAllAsTouched();
    if (this.postSettingFG.invalid) return;

    const previewDailog: DialogReqData = {
      promotion: {
        id: null,
        promoCode: null,
        promoType: this.firstFormGroup.controls.promoType.value,
        promoTitle: this.firstFormGroup.controls.promoTitle.value,
        appPlatform: this.firstFormGroup.controls.appPlatform.value,
        promoPeriodType: this.firstFormGroup.controls.promoPeriodType.value,
        startDate: this.firstFormGroup.controls.startDate.value,
        endDate: this.firstFormGroup.controls.endDate.value,
        status: null,
        viewStatus: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
      },
      postSetting: this.postSettingFG.value,
      appSetting: null,
      ruleSetting: null,
      issueSetting: [],
      bonusLevelSettings: [],
    };
    this.openDialogShowSetting(previewDailog);
  }

  openDialogShowSetting(data: DialogReqData = null) {
    const dialogRef = this.dialog.open(
      PromotionRuleSettingReviewDialogComponent,
      {
        data: data,
        width: '95%',
        height: '95%',
        maxHeight: '98%',
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      const body = {
        ...this.firstFormGroup.value,
        postSetting: this.postSettingFG.value,
      };
      if (this.operation == 'EDIT') {
        this.editOne(body);
      } else {
        this.insertOne(body);
      }
    });
  }

  insertOne(body) {
    let dialogMes = MessageService.DIALOGMSGCONFIRM.SAVE;
    let url = 'promotion/new-promotion';
    if (this.operation == 'CLONE') {
      MessageService.DIALOGMSGCONFIRM.CLONE;
      url = 'promotion/clone-promotion';
    }
    DialogSweetAlertService.opentModalSweetAlertConfirm('', dialogMes, () => {
      this.httpCli.doPost(url, body).subscribe((res) => {
        if (res.status === MessageService.MSG.SUCCESS) {
          this.location.back();
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      });
    });
  }

  editOne(body) {
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.EDIT,
      () => {
        this.httpCli
          .doPut(`promotion/edit-promotion/${this.promoCode}`, body)
          .subscribe((res) => {
            if (res.status === MessageService.MSG.SUCCESS) {
              this.location.back();
              // this.disabledBtn = false;
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }

  getPromoDetail(promoCode) {
    this.httpCli
      .doGet(`promotion/get-by-promo-code?promoCode=${promoCode}`)
      .subscribe((res) => {
        if (res.status === MessageService.MSG.SUCCESS) {
          this.setForm(res.data);
        }
      });
  }

  setDisabledForm() { }

  cdkData = null
  setForm(data: PromotionDetailModel) {
    this.firstFormGroup.patchValue({
      promoTitle: data.promotion.promoTitle,
      promoType: data.promotion.promoType,
      appPlatform: data.promotion.appPlatform,
      promoPeriodType: data.promotion.promoPeriodType,
      startDate: data.promotion.startDate,
      endDate: data.promotion.endDate,
    });

    this.postSettingFG.patchValue({
      lang: data.postSetting.lang,
      deskBanner: data.postSetting.deskBanner,
      deskDetail: data.postSetting.deskDetail,
    });
    this.cdkData = data.postSetting.deskDetail

  }

  strToArr(str) {
    if (str instanceof Array) {
      return str;
    }
    if (str) {
      return str.split(',');
    }
    return [];
  }
}
