import { PromotionRuleSettingAddGeneralDepositComponent } from './promotion-rule-setting-add-general-deposit/promotion-rule-setting-add-general-deposit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionRuleSettingComponent } from './promotion-rule-setting/promotion-rule-setting.component';
import { PromotionRuleSettingAddComponent } from './promotion-rule-setting-add/promotion-rule-setting-add.component';
import { RebateHistoryComponent } from './rebate-history/rebate-history.component';
import { RebateSettingComponent } from './rebate-setting/rebate-setting.component';
import { PendingRebateComponent } from './pending-rebate/pending-rebate.component';
import { PromotionRequestComponent } from './promotion-request/promotion-request.component';
import { PromotionRequestAddComponent } from './promotion-request-add/promotion-request-add.component';
import { PromotionRequestSystemDeclinedComponent } from './promotion-request-system-declined/promotion-request-system-declined.component';
import { PrsEditDisplayOrderComponent } from './promotion-rule-setting/dialog/prs-edit-display-order/prs-edit-display-order.component';
import { PrsUniversalSettingComponent } from './promotion-rule-setting/dialog/prs-universal-setting/prs-universal-setting.component';
import { RebateSettingAddComponent } from './rebate-setting-add/rebate-setting-add.component';
import { PromotionRuleSettingAddFirstAndSecondDepositComponent } from './promotion-rule-setting-add-first-and-second-deposit/promotion-rule-setting-add-first-and-second-deposit.component';
import { PromotionRuleSettingAddRegistrantionComponent } from './promotion-rule-setting-add-registrantion/promotion-rule-setting-add-registrantion.component';
import { PromotionRuleSettingAddCustomizedComponent } from './promotion-rule-setting-add-customized/promotion-rule-setting-add-customized.component';
import { PromotionRuleSettingAddPromotionPostingComponent } from './promotion-rule-setting-add-promotion-posting/promotion-rule-setting-add-promotion-posting.component';

const routes: Routes = [
  { path: '', redirectTo: 'promotion-rule' },
  { path: 'promotion-rule', component: PromotionRuleSettingComponent },
  { path: 'promotion-rule/promotion-rule-setting', component: PrsEditDisplayOrderComponent },
  { path: 'promotion-rule/prs-universal-setting', component: PrsUniversalSettingComponent },
  { path: 'promotion-rule-add', component: PromotionRuleSettingAddComponent },
  { path: 'promotion-rule-add/registrantion', component: PromotionRuleSettingAddRegistrantionComponent },
  { path: 'promotion-rule-add/first-and-second-deposit', component: PromotionRuleSettingAddFirstAndSecondDepositComponent },
  { path: 'promotion-rule-add/customized', component: PromotionRuleSettingAddCustomizedComponent },
  { path: 'promotion-rule-add/general-deposit', component: PromotionRuleSettingAddGeneralDepositComponent },
  { path: 'promotion-request', component: PromotionRequestComponent },
  { path: 'promotion-request/promotion-request-add', component: PromotionRequestAddComponent },
  { path: 'promotion-request/promotion-request-system-declined', component: PromotionRequestSystemDeclinedComponent },
  { path: 'rebate-history', component: RebateHistoryComponent },
  { path: 'rebate-setting', component: RebateSettingComponent },
  { path: 'rebate-setting/rebate-setting-add', component: RebateSettingAddComponent },
  { path: 'pending-rebate', component: PendingRebateComponent },
  { path: 'promotion-rule-add/promotion-posting', component: PromotionRuleSettingAddPromotionPostingComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionRoutingModule { }
