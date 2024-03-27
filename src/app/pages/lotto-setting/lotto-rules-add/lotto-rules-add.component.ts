import { start } from 'repl';
import { MessageService } from './../../../service/message.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeanService } from 'src/app/service/BeanService.service';
import { Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { defaultMemoize } from '@ngrx/store';
const URL = {
  SAVE_RULE_DES: "add-rule-lotto/add-rule-detail",
  UPDATE_RULE_DES: "add-rule-lotto/update-rule-detail-by-class",
  DELETE_RULE_CONFIG_IMG: 'add-rule-lotto/delete-rule-config-image-by-code',
  DELETE_RULE_CONFIG: 'add-rule-lotto/delete-rule-config-by-code',
  GET_RULE_DETAIL: "add-rule-lotto/get-rule-detail-by-class"
}
@Component({
  selector: 'app-lotto-rules-add',
  templateUrl: './lotto-rules-add.component.html',
  styleUrls: ['./lotto-rules-add.component.scss']
})
export class LottoRulesAddComponent implements OnInit {

  className: any;
  classCode: any;
  prefix: any;
  fileName = '';
  file = '';
  tmp: any = '';
  ruleDetailList = {
    classCode: null,
    prefix: null,
    ruleDesList: [],
    ruleImageList: [],
  }
  ruleDesArray = []
  imageArr = []
  constructor(
    private router: Router,
    private httpBeanService: BeanService,
    private routeParam: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
  ) {
    this.routeParam.queryParams.subscribe(res => {
      if (res) {
        this.className = res.className;
        this.classCode = res.classCode;
        this.prefix = res.prefix;
      }
    });
  }

  ngOnInit(): void {
    this.getRuleDesDetail();
    // this.addRow();
  }

  preview(files, i) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    this.ruleDesArray[i].oldImage = this.ruleDesArray[i].imageRule;
    this.fileName = files[0].name;
    this.file = files[0];

    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.ruleDesArray[i].imageRule = reader.result;
      this.ruleDesArray[i].imageRulePath = reader.result;
    };
  }

  preview2(files, i) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    this.imageArr[i].oldImage = this.imageArr[i].imageRule;
    this.fileName = files[0].name;
    this.file = files[0];

    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imageArr[i].imageRule = reader.result;
      this.imageArr[i].imageRulePath = reader.result;
    };
  }

  onChange($event, i) {

    this.ruleDesArray[i].ruleDes = $event
    // this.formRules.get('ruleDes').patchValue($event);
  }

  reset1(i) {
    this.imageArr[i].imageRule = this.imageArr[i].oldImage;
    if (this.imageArr[i].oldImage) {
      this.imageArr[i].imageRulePath = "https://finnbet.com/COFFEE-FILE/api/img/get-img?path=" + this.imageArr[i].oldImage;
    }
    else {
      this.imageArr[i].imageRulePath = '';
    }
    // this.imageArr[i].imageRulePath = "https://finnbet.com/COFFEE-FILE/api/img/get-img?path=" + this.imageArr[i].oldImage;
    this.imageArr[i].oldImage = '';
  }

  reset2(i) {
    this.ruleDesArray[i].imageRule = this.ruleDesArray[i].oldImage;
    if (this.ruleDesArray[i].oldImage) {
      this.ruleDesArray[i].imageRulePath = "https://finnbet.com/COFFEE-FILE/api/img/get-img?path=" + this.ruleDesArray[i].oldImage;
    }
    else {
      this.ruleDesArray[i].imageRulePath = '';
    }
    // this.ruleDesArray[i].imageRulePath = "https://finnbet.com/COFFEE-FILE/api/img/get-img?path=" + this.imageArr[i].oldImage;
    this.ruleDesArray[i].oldImage = '';
  }

  addRow() {
    const row = {
      ruleDes: null,
      imageRule: null
    }
    this.ruleDesArray.push(row)
  }
  addImageRow() {
    const imageRow = {
      imageRule: null,
    }
    this.imageArr.push(imageRow)

  }

  test() {
    this.ruleDetailList.ruleDesList = this.ruleDesArray
    this.ruleDetailList.ruleImageList = this.imageArr
    this.ruleDetailList.classCode = this.classCode
    this.ruleDetailList.prefix = this.prefix
    console.log(this.ruleDetailList)
  }

  dropRow(i) {
    console.log(this.ruleDesArray[i]);
    let ruleCode = this.ruleDesArray[i]['ruleCode'];
    let imageRule = this.ruleDesArray[i]['imageRule'];
    this.ruleDesArray.splice(i, 1);
    console.log(imageRule);
    this.httpBeanService.doDelete(`${URL.DELETE_RULE_CONFIG}?ruleCode=${ruleCode}`).subscribe(res => {
      console.log(res);
      if (res.start == 'SUCCESS') {
        this.httpBeanService.doDelete(`https://finnbet.com/COFFEE-FILE/api/img/delete?path=${imageRule}`).subscribe(res => {
          console.log(res);
          if (res.start == 'SUCCESS') {
            this.getRuleDesDetail();
          }
        });
      }
    });

  }

  dropRow2(i) {
    console.log(this.imageArr[i]);
    let ruleCode = this.imageArr[i]['ruleCode'];
    let imageRule = this.imageArr[i]['imageRule'];
    this.imageArr.splice(i, 1);
    this.httpBeanService.doDelete(`${URL.DELETE_RULE_CONFIG_IMG}?ruleCode=${ruleCode}`).subscribe(res => {
      console.log(res)
      if (res.start == 'SUCCESS') {
        this.httpBeanService.doDelete(`https://finnbet.com/COFFEE-FILE/api/img/delete?path=${imageRule}`).subscribe(res => {
          console.log(res);
          if (res.start == 'SUCCESS') {
            this.getRuleDesDetail();
          }
        });
      }
    });

  }

  onSave() {

    this.ruleDetailList.ruleDesList = this.ruleDesArray
    this.ruleDetailList.ruleImageList = this.imageArr
    this.ruleDetailList.classCode = this.classCode
    this.ruleDetailList.prefix = this.prefix
    console.log(this.ruleDetailList);

    this.httpBeanService.doPost(URL.UPDATE_RULE_DES, this.ruleDetailList).subscribe(res => {
      console.log(res)
      if (res.status == 'SUCCESS') {
        this.getRuleDesDetail();
      }
    })

  }

  onBack() {
    this.location.back()
  }

  getRuleDesDetail() {
    this.httpBeanService.doGet(`${URL.GET_RULE_DETAIL}/${this.classCode}`).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.ruleDesArray = res.data.ruleDesList;
        this.ruleDesArray.forEach(item => {
          if (item.imageRule) {
            item.imageRulePath = "https://finnbet.com/COFFEE-FILE/api/img/get-img?path=" + item.imageRule;
            item.oldImage = '';
          }
        }); defaultMemoize

        this.imageArr = res.data.ruleImageList;
        this.imageArr.forEach(item => {
          if (item.imageRule) {
            item.imageRulePath = "https://finnbet.com/COFFEE-FILE/api/img/get-img?path=" + item.imageRule;
            item.oldImage = '';
          }

        });
        if (this.ruleDesArray.length == 0) {
          this.addRow();
        }

      }
    })
  }


}
