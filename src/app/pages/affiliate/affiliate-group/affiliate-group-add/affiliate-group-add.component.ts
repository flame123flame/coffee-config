import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/service/BaseService.service';
import { MessageService } from 'src/app/service/message.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { table } from 'console';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { MatOptionSelectionChange } from '@angular/material/core/option/option';
import { MatTable } from '@angular/material/table';
import { GameProviderRes } from 'src/app/pages/rebate_management/rebate-setting-new-add/rebate-setting-new-add.component';
import { GameGroupMappingProviderModel } from 'src/app/models/respons-interface/GameGroupMappingProvider';
import { GameProductTypeMappingProviderModel } from 'src/app/models/respons-interface/GameProductTypeMappingProvider';
import { GameProviderModel } from 'src/app/models/respons-interface/GameProvider';
import { GameGroupModel } from 'src/app/models/respons-interface/GameGroup';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
const URL = {
  GET_BY_CODE: 'affiliate-group/get-affiliate-group-by-code/',
  GET_PRODUCTYPE: 'game-product-type/product-list',
  SAVE: 'affiliate-group/save-affiliate-group',
  EDIT: 'affiliate-group/edit-affiliate-group',
  DELETE: 'affiliate-channel/delete-affiliate-channel/',

  GET_PROVIDER: 'game-provider/get-provider-list',
  GET_GAME_GROUP: 'game-group/get-all',
  GET_PRODUCT_TYPE_MAPPING: 'product-mapping-provider',
  GET_GAMEGROUP_MAPPING: 'group-mapping-provider',
};
@Component({
  selector: 'app-affiliate-group-add',
  templateUrl: './affiliate-group-add.component.html',
  styleUrls: ['./affiliate-group-add.component.scss'],
})
export class AffiliateGroupAddComponent implements OnInit {
  formAffiliateGroup: FormGroup;
  productType = [];
  constructor(
    private router: Router,
    private httpService: BaseService,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }
  datatable = [
  ]
  allList = [{
    nameTh: 'ทั้งหมด',
    code: ''
  }]
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  col = [
    'channelName',
    'productType',
    'provider',
    'gameGroup',
    'shareRateOne',
    'shareRateTwo',
    'remark',
    'action',
  ]

  ngOnInit(): void {
    const affiliateGroupCode = this.route.snapshot.queryParams[
      'affiliateGroupCode'
    ];
    if (affiliateGroupCode != null) {
      this.getByCode(affiliateGroupCode);
    } else {
      this.datatable = [];
    }
    this.getProductTypeList();
    this.getGetProvider();
    this.getGetGameGroup();
    this.getGetProductTypeMapping();
    this.getGetGamegroupMapping();
  }

  createForm() {
    this.formAffiliateGroup = this.formBuilder.group({
      affiliateGroupCode: [null],
      groupName: [null, [Validators.required]],
      description: [null],
      withdrawCondition: [null, [Validators.required]],
      minTotalBets: [0, [Validators.required]],
      minAffiliateCount: [0, [Validators.required]],
      minTotalIncome: [0, [Validators.required]],
      channelList: [[]],
    });
  }

  onClearForm() {
    this.formAffiliateGroup.patchValue({
      affiliateGroupCode: null,
      groupName: null,
      description: null,
      withdrawCondition: null,
      minTotalBets: 0,
      minAffiliateCount: 0,
      minTotalIncome: 0,
      channelList: [],
    });
    this.datatable = [];
  }

  checkForm() {
    if (this.formAffiliateGroup.invalid || !this.checkTableValidate()) {
      this.formAffiliateGroup.markAllAsTouched();
      DialogSweetAlertService.opentModalSweetAlertError('', MessageService.MSG.REQUIRE_FIELD);
      return
    }
    if (this.formAffiliateGroup.value.affiliateGroupCode != null) {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.EDIT, () => {
        this.editAffiliateGroup();
      });
    } else if (this.formAffiliateGroup.value.affiliateGroupCode == null) {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.saveAffiliateGroup();
      });
    }
  }

  saveAffiliateGroup() {
    this.formAffiliateGroup.value.channelList = this.datatable;
    console.log(this.formAffiliateGroup.value);
    this.httpService
      .doPost(URL.SAVE, this.formAffiliateGroup.value)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.SAVE.SUCCESS);
          this.location.back();
        } else {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.SAVE.FAILED);
        }
      });
  }
  editAffiliateGroup() {
    this.formAffiliateGroup.value.channelList = this.datatable;
    this.httpService
      .doPut(URL.EDIT, this.formAffiliateGroup.value)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.EDIT.SUCCESS);
          this.location.back();
        } else {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.EDIT.FAILED);
        }
      });
  }
  getByCode(data) {
    this.httpService.doGet(URL.GET_BY_CODE + data).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formAffiliateGroup.patchValue({
          affiliateGroupCode: res.data.affiliateGroupCode,
          groupName: res.data.groupName,
          description: res.data.description,
          withdrawCondition: res.data.withdrawCondition,
          minTotalBets: res.data.minTotalBets,
          minAffiliateCount: res.data.minAffiliateCount,
          minTotalIncome: res.data.minTotalIncome,
          channelList: res.data.channelList,
        });
        this.datatable = res.data.channelList.map((data, inx) => {
          return {
            affiliateChannelCode: data.affiliateChannelCode,
            channelName: data.channelName,
            productType: data.productTypeCode,
            provider: data.providerCode,
            gameGroup: data.gameGroupCode,
            shareRateOne: data.shareRateOne,
            shareRateTwo: data.shareRateTwo,
            remark: data.remark,
          };
        });
        console.log(this.datatable);
      }
    });
  }
  addChannel() {
    this.datatable.push({
      channelName: null,
      productType: null,
      provider: '',
      gameGroup: '',
      shareRateOne: null,
      shareRateTwo: null,
      remark: null
    });
    this.table.renderRows();

  }

  deleteOne(data, row) {
    if (data) {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
        this.httpService.doDelete(URL.DELETE + data).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
            if (MessageService.MSG.SUCCESS == res.status) {
              this.datatable = res.data.map((data) => {
                return {
                  channelName: data.channelName,
                  productType: data.productTypeCode,
                  provider: data.providerCode,
                  gameGroup: data.gameGroupCode,
                  shareRateOne: data.shareRateOne,
                  shareRateTwo: data.shareRateTwo,
                  remark: data.remark,
                };
              });
              this.datatable.splice(row, 1);
              this.table.renderRows();
            }
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      })

    } else {
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
        this.datatable.splice(row, 1);
        this.table.renderRows();
        DialogSweetAlertService.opentModalSweetAlertSuccess('', MessageService.DELETE.SUCCESS);
      })
    }
  }
  getProductTypeList() {
    this.httpService.doGet(URL.GET_PRODUCTYPE).subscribe((res) => {
      this.productType = res.data.map(ele => {
        return {
          name: ele.nameTh,
          code: ele.code,
        }
      });
    });
  }

  provider: GameProviderModel[] = []
  gameGroup: GameGroupModel[] = []
  productTypeMapping: GameProductTypeMappingProviderModel[] = []
  gamegroupMapping: GameGroupMappingProviderModel[] = []

  getGetProvider() {
    this.httpService.doGet(URL.GET_PROVIDER).subscribe((res) => {
      this.provider = res.data;
    });
  }
  getGetGameGroup() {
    this.httpService.doGet(URL.GET_GAME_GROUP).subscribe((res) => {
      this.gameGroup = res.data;
    });
  }
  getGetProductTypeMapping() {
    this.httpService.doGet(URL.GET_PRODUCT_TYPE_MAPPING).subscribe((res) => {
      this.productTypeMapping = res.data;
    });
  }
  getGetGamegroupMapping() {
    this.httpService.doGet(URL.GET_GAMEGROUP_MAPPING).subscribe((res) => {
      this.gamegroupMapping = res.data;
    });
  }

  getProviderList(code) {
    let avilable = this.productTypeMapping.filter(ele => ele.productCode == code)
    if (avilable.length != 0) {
      let provider = avilable.map(ele => ele.providerCode);
      let filter = this.provider.filter(ele => provider.includes(ele.code));
      return [...this.allList, ...filter]
    }
    return [...this.allList]
  }

  getGameGroupList(code, productTypeCode) {
    let avilable;
    if (code == "") {
      let provider = this.productTypeMapping.filter(ele => ele.productCode == productTypeCode)
      avilable = this.gamegroupMapping.filter(ele => provider.find(el => el.providerCode === ele.providerCode))
    } else {
      avilable = this.gamegroupMapping.filter(ele => ele.providerCode == code)
    }
    if (avilable.length != 0) {
      let provider = avilable.map(ele => ele.gameGroupCode);
      let filter = this.gameGroup.filter(ele => provider.includes(ele.code))
      return [...this.allList, ...filter]
    }
    return [...this.allList]
  }

  checkTableValidate() {
    return this.datatable.every(ele => ele.channelName != null &&
      ele.productType != null &&
      ele.provider != null &&
      ele.shareRateOne != null &&
      ele.shareRateTwo != null
    )
  }
}
