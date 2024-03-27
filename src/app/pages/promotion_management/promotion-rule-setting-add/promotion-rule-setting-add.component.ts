import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-promotion-rule-setting-add',
  templateUrl: './promotion-rule-setting-add.component.html',
  styleUrls: ['./promotion-rule-setting-add.component.scss'],
})
export class PromotionRuleSettingAddComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onRegistrantion() {
    this.router.navigate(['promotion-management/promotion-rule-add/registrantion']);
  }

  onFirstAndSecondDeposit() {
    this.router.navigate(['promotion-management/promotion-rule-add/first-and-second-deposit']);
  }

  onGeneralDeposit() {
    this.router.navigate(['promotion-management/promotion-rule-add/general-deposit']);
  }

  goRoute(route) {
    this.router.navigate(['promotion-management/promotion-rule-add/' + route]);
  }

  onPromotionPosting() {
    this.router.navigate(['promotion-management/promotion-rule-add/promotion-posting']);
  }
}
