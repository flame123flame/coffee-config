import { LottoReportDetailComponent } from './lotto-setting/lotto-report/lotto-report-detail/lotto-report-detail.component';
import { PrsShowSettingComponent } from './promotion_management/promotion-rule-setting/dialog/prs-show-setting/prs-show-setting.component';
import { AffiliateProfileComponent } from './affiliate/affiliate-profile/affiliate-profile.component';
import { GamesAddDialogComponent } from './casino_settings/provider-setting/games-add-dialog/games-add-dialog.component';
import { ProviderAddDialogComponent } from './casino_settings/provider-setting/provider-add-dialog/provider-add-dialog.component';
import { GameListDisplayNameDialogComponent } from './casino_settings/game-list/game-list-display-name-dialog/game-list-display-name-dialog.component';
import { AddCompanyAccountDialogComponent } from './finance_management/company-account/add-company-account-dialog/add-company-account-dialog.component';
import { CompanyAccountLogComponent } from './finance_management/company-account-log/company-account-log.component';
import { AddBankDialogComponent } from './finance_management/bank-list/add-bank-dialog/add-bank-dialog.component';
import { NewTagDialogComponent } from './player_management/tag-management/new-tag-dialog/new-tag-dialog.component';
import { ConcurrentPlayersComponent } from './player_management/concurrent-players/concurrent-players.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module';
import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';

import { PlayerListComponent } from './player_management/playerlist/playerlist.component';
import { NewRegistrantComponent } from './player_management/new-registrant/new-registrant.component';
import { FailedLoginComponent } from './player_management/failed-login/failed-login.component';
import { FailedRegistrationComponent } from './player_management/failed-registration/failed-registration.component';
import { TagManagementComponent } from './player_management/tag-management/tag-management.component';
import { GroupLevelComponent } from './player_management/group-level/group-level.component';

import { WalletTranferComponent } from './finance_management/wallet-tranfer/wallet-tranfer.component';
import { WithdrawalListComponent } from './finance_management/withdrawal-list/withdrawal-list.component';
import { DepositListComponent } from './finance_management/deposit-list/deposit-list.component';
import { WithdrawalConditionComponent } from './finance_management/withdrawal-condition/withdrawal-condition.component';
import { BankListComponent } from './finance_management/bank-list/bank-list.component';
import { CompanyAccountComponent } from './finance_management/company-account/company-account.component';
import { ManualAdjustmentComponent } from './finance_management/manual-adjustment/manual-adjustment.component';

import { PromotionRuleSettingComponent } from './promotion_management/promotion-rule-setting/promotion-rule-setting.component';
import { RebateHistoryComponent } from './promotion_management/rebate-history/rebate-history.component';
import { RebateSettingComponent } from './promotion_management/rebate-setting/rebate-setting.component';
import { PendingRebateComponent } from './promotion_management/pending-rebate/pending-rebate.component';
import { PromotionRequestComponent } from './promotion_management/promotion-request/promotion-request.component';

import { AgentTeamApplyListComponent } from './agent_team/agent-team-apply-list/agent-team-apply-list.component';
import { AgentTeamListComponent } from './agent_team/agent-team-list/agent-team-list.component';
import { AgentTeamReportComponent } from './agent_team/agent-team-report/agent-team-report.component';
import { AgentPositionTakingComponent } from './agent_team/agent-position-taking/agent-position-taking.component';
import { AgentAdjustmentComponent } from './agent_team/agent-adjustment/agent-adjustment.component';

import { IpfpRuleComponent } from './risk_management/ipfp-rule/ipfp-rule.component';
import { IpRuleComponent } from './risk_management/ip-rule/ip-rule.component';

import { OverallReportComponent } from './report/overall-report/overall-report.component';

import { GameListComponent } from './casino_settings/game-list/game-list.component';
import { ProductMaintenanceComponent } from './casino_settings/product-maintenance/product-maintenance.component';
import { SportsValidBetsComponent } from './casino_settings/sports-valid-bets/sports-valid-bets.component';

import { AffiliateListComponent } from './affiliate/affiliate-list/affiliate-list.component';
import { AffiliateBonusSettingComponent } from './affiliate/affiliate-bonus-setting/affiliate-bonus-setting.component';

import { AdminListComponent } from './admin_management/admin-list/admin-list.component';
import { RolePremissionComponent } from './admin_management/role-premission/role-premission.component';
import { AdminLogsComponent } from './admin_management/admin-logs/admin-logs.component';
import { RebateStartNewComponent } from './rebate_management/rebate-start-new/rebate-start-new.component';
import { RebateSettingNewComponent } from './rebate_management/rebate-setting-new/rebate-setting-new.component';
import { RebateHistoryNewComponent } from './rebate_management/rebate-history-new/rebate-history-new.component';
import { RebatePendingNewComponent } from './rebate_management/rebate-pending-new/rebate-pending-new.component';
import { from } from 'rxjs';
import { BettingHostoriesComponent } from './report/betting-hostories/betting-hostories.component';
import { PlayerValidBetsComponent } from './report/player-valid-bets/player-valid-bets.component';
import { GameReportComponent } from './report/game-report/game-report.component';
import { PlayerReportComponent } from './report/player-report/player-report.component';
import { ProfitOrLossReportComponent } from './report/profit-or-loss-report/profit-or-loss-report.component';
import { PromotionReportComponent } from './report/promotion-report/promotion-report.component';
import { AllTransactionComponent } from './finance_management/all-transaction/all-transaction.component';

import { GroupLevelAddNewGroupComponent } from './player_management/group-level-add-new-group/group-level-add-new-group.component';
import { GroupLevelAdjustLevelComponent } from './player_management/group-level-adjust-level/group-level-adjust-level.component';
import { PromotionRuleSettingAddComponent } from './promotion_management/promotion-rule-setting-add/promotion-rule-setting-add.component';
import { GroupLevelLevelAdjustmentRecordComponent } from './player_management/group-level-level-adjustment-record/group-level-level-adjustment-record.component';
import { RebateSettingNewAddComponent } from './rebate_management/rebate-setting-new-add/rebate-setting-new-add.component';
import { DepositListAddComponent } from './finance_management/deposit-list-add/deposit-list-add.component';
import { NewAdminComponent } from './admin_management/admin-list/chlidren/new-admin/new-admin.component';
import { PromotionRequestAddComponent } from './promotion_management/promotion-request-add/promotion-request-add.component';
import { PlayerlistNewPlayerComponent } from './player_management/playerlist-new-player/playerlist-new-player.component';
import { PromotionRequestSystemDeclinedComponent } from './promotion_management/promotion-request-system-declined/promotion-request-system-declined.component';
import { ConfirmReAssignLevelComponent } from './player_management/group-level/dialog/confirm-re-assign-level/confirm-re-assign-level.component';
import { PrsEditDisplayOrderComponent } from './promotion_management/promotion-rule-setting/dialog/prs-edit-display-order/prs-edit-display-order.component';

import { WithdrawalListAddComponent } from './finance_management/withdrawal-list-add/withdrawal-list-add.component';
import { PrsUniversalSettingComponent } from './promotion_management/promotion-rule-setting/dialog/prs-universal-setting/prs-universal-setting.component';
import { RebateSettingAddComponent } from './promotion_management/rebate-setting-add/rebate-setting-add.component';
import { IpRuleAddComponent } from './risk_management/ip-rule/dialog/ip-rule-add/ip-rule-add.component';
import { AgentTeamListAddComponent } from './agent_team/agent-team-list-add/agent-team-list-add.component';
import { RolePremissionAddComponent } from './admin_management/role-premission/dialog/role-premission-add/role-premission-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepositRequestDetailComponent } from './finance_management/deposit-list/fragement/deposit-request-detail/deposit-request-detail.component';
import { PlayerProfileComponent } from './player_management/playerlist/player-profile/player-profile.component';
import { PromotionRuleSettingAddFirstAndSecondDepositComponent } from './promotion_management/promotion-rule-setting-add-first-and-second-deposit/promotion-rule-setting-add-first-and-second-deposit.component';
import { ProviderSettingComponent } from './casino_settings/provider-setting/provider-setting.component';
import { PromotionRuleSettingAddRegistrantionComponent } from './promotion_management/promotion-rule-setting-add-registrantion/promotion-rule-setting-add-registrantion.component';
import { RebateSettingNewAddDialogComponent } from './rebate_management/rebate-setting-new-add/rebate-setting-new-add-dialog/rebate-setting-new-add-dialog.component';
import { PromotionRuleSettingAddCustomizedComponent } from './promotion_management/promotion-rule-setting-add-customized/promotion-rule-setting-add-customized.component';
import { AffiliateGroupComponent } from './affiliate/affiliate-group/affiliate-group.component';
import { AffiliateGroupAddComponent } from './affiliate/affiliate-group/affiliate-group-add/affiliate-group-add.component';
import { PrsReviewPageComponent } from './promotion_management/promotion-rule-setting/dialog/prs-review-page/prs-review-page.component';
import { CashbackHistoryNewComponent } from './cashback_management/cashback-history-new/cashback-history-new.component';
import { CashbackPendingNewComponent } from './cashback_management/cashback-pending-new/cashback-pending-new.component';
import { CashbackSettingNewComponent } from './cashback_management/cashback-setting-new/cashback-setting-new.component';
import { CashbackSettingNewAddComponent } from './cashback_management/cashback-setting-new-add/cashback-setting-new-add.component';
import { CashbackStartNewComponent } from './cashback_management/cashback-start-new/cashback-start-new.component';
import { CashbackSettingNewAddDialogComponent } from './cashback_management/cashback-setting-new-add/cashback-setting-new-add-dialog/cashback-setting-new-add-dialog.component';
import { BankVerifyComponent } from './player_management/bank-verify/bank-verify.component';
import { PromotionRequestDialogComponent } from './promotion_management/promotion-request/promotion-request-dialog/promotion-request-dialog.component';
import { LottoGovernmentComponent } from './lotto-setting/lotto-government/lotto-government.component';
import { LottoStockComponent } from './lotto-setting/lotto-stock/lotto-stock.component';
import { LottoYikiComponent } from './lotto-setting/lotto-yiki/lotto-yiki.component';
import { LottoGovernmentAddComponent } from './lotto-setting/lotto-government-add/lotto-government-add.component';
import { LottoGovernmentLimitNumberComponent } from './lotto-setting/lotto-government-limit-number/lotto-government-limit-number.component';
import { LottoGovernmentLimitNumberDialogComponent } from './lotto-setting/lotto-government-limit-number/lotto-government-limit-number-dialog/lotto-government-limit-number-dialog.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { LottoHistoryComponent } from './lotto-setting/lotto-history/lotto-history.component';
import { LottoHistoryDetailComponent } from './lotto-setting/lotto-history-detail/lotto-history-detail.component';
import { LottoConfigComponent } from './lotto-setting/lotto-config/lotto-config.component';
import { LottoConfigAddGroupComponent } from './lotto-setting/lotto-config-add-group/lotto-config-add-group.component';
import { LottoConfigAddMaxMinComponent } from './lotto-setting/lotto-config-add-max-min/lotto-config-add-max-min.component';
import { LottoConfigAddPrizeComponent } from './lotto-setting/lotto-config-add-prize/lotto-config-add-prize.component';
import { LottoConfigDialogConfirmComponent } from './lotto-setting/lotto-config/lotto-config-dialog-confirm/lotto-config-dialog-confirm.component';
import { PromotionRuleSettingAddGeneralDepositComponent } from './promotion_management/promotion-rule-setting-add-general-deposit/promotion-rule-setting-add-general-deposit.component';
import { LottoDashboardComponent } from './lotto-setting/lotto-dashboard/lotto-dashboard.component';
import { HotIssueComponent } from './player_management/hot-issue/hot-issue.component';
import { IssueTypeAddDialogComponent } from './player_management/hot-issue/issue-type-add-dialog/issue-type-add-dialog.component';
import { HotIssueDialogComponent } from './player_management/hot-issue/hot-issue-dialog/hot-issue-dialog.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { PromotionRuleSettingAddPromotionPostingComponent } from './promotion_management/promotion-rule-setting-add-promotion-posting/promotion-rule-setting-add-promotion-posting.component';
import { LottoGroupComponent } from './lotto-setting/lotto-group/lotto-group.component';
import { LottoGroupAddEditComponent } from './lotto-setting/lotto-group-add-edit/lotto-group-add-edit.component';
import { ProductMappingDialogComponent } from './casino_settings/provider-setting/product-mapping-dialog/product-mapping-dialog.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { WithdrawalListRemarkDialogComponent } from './finance_management/withdrawal-list/withdrawal-list-remark-dialog/withdrawal-list-remark-dialog.component';
import { LottoApprovedComponent } from './lotto-setting/lotto-approved/lotto-approved.component';
import { LottoApprovedDetailComponent } from './lotto-setting/lotto-approved/lotto-approved-detail/lotto-approved-detail.component';
import { LottoResultComponent } from './lotto-setting/lotto-result/lotto-result.component';
import { GroupMappingProviderDialogComponent } from './casino_settings/provider-setting/group-mapping-provider-dialog/group-mapping-provider-dialog.component';
import { GroupAddDialogComponent } from './casino_settings/provider-setting/group-add-dialog/group-add-dialog.component';
import { LottoRemarkComponent } from './lotto-setting/lotto-government/lotto-remark/lotto-remark.component';
import { LottoReportComponent } from './lotto-setting/lotto-report/lotto-report.component';
import { LottoStockAddComponent } from './lotto-setting/lotto-stock-add/lotto-stock-add.component';
import { ConfirmTransactionComponent } from './lotto-setting/confirm-transaction/confirm-transaction.component';
import { LottoGovernmentCloseNumberComponent } from './lotto-setting/lotto-government-close-number/lotto-government-close-number.component';
import { LottoGovernmentCloseNumberDialogComponent } from './lotto-setting/lotto-government-close-number/lotto-government-close-number-dialog/lotto-government-close-number-dialog.component';
import { LottoDraftClassComponent } from './lotto-setting/lotto-draft-class/lotto-draft-class.component';
import { PromotionRuleSettingReviewDialogComponent } from './promotion_management/promotion-rule-setting-review-dialog/promotion-rule-setting-review-dialog.component';
import { YeekeeAddComponent } from './lotto-setting/yeekee-add/yeekee-add.component';
import { ProductTypeListComponent } from './casino_settings/product-type-list/product-type-list.component';
import { GameGroupListComponent } from './casino_settings/game-group-list/game-group-list.component';
import { ProviderListComponent } from './casino_settings/provider-list/provider-list.component';
import { GameTagSettingComponent } from './casino_settings/game-tag-setting/game-tag-setting.component';
import { GameTagEditDialogComponent } from './casino_settings/game-tag-setting/game-tag-edit-dialog/game-tag-edit-dialog.component';
import { GameTagOrderEditDialogComponent } from './casino_settings/game-tag-setting/game-tag-order-edit-dialog/game-tag-order-edit-dialog.component';
import { YeekeeAddPrizeComponent } from './lotto-setting/yeekee-add-prize/yeekee-add-prize.component';
import { YeekeeAddMaxMinComponent } from './lotto-setting/yeekee-add-max-min/yeekee-add-max-min.component';
import { YeekeeAddWinSeqPrizeComponent } from './lotto-setting/yeekee-add-win-seq-prize/yeekee-add-win-seq-prize.component';
import { YeekeeAddDummyUserComponent } from './lotto-setting/yeekee-add-dummy-user/yeekee-add-dummy-user.component';
import { GameTagAddGameDialogComponent } from './casino_settings/game-tag-setting/game-tag-add-game-dialog/game-tag-add-game-dialog.component';
import { YeekeeApproveComponent } from './lotto-setting/yeekee-approve/yeekee-approve.component';
import { YeekeeApproveDetailComponent } from './lotto-setting/yeekee-approve-detail/yeekee-approve-detail.component';
import { ContactUsComponent } from './player_management/contact-us/contact-us.component';
import { InboxMessageComponent } from './frontend_management/inbox-message/inbox-message.component';
import { SendMessageDialogComponent } from './frontend_management/inbox-message/send-message-dialog/send-message-dialog.component';
import { LottoCancelComponent } from './lotto-setting/lotto-cancel/lotto-cancel.component';
import { LandingSettingComponent } from './frontend_management/landing-setting/landing-setting.component';
import { LandingSettingAddComponent } from './frontend_management/landing-setting/landing-setting-add/landing-setting-add.component';
import { DepositSettingComponent } from './frontend_management/deposit-setting/deposit-setting.component';
import { LottoReportRoundComponent } from './lotto-setting/lotto-report/lotto-report-round/lotto-report-round.component';
import { CashbackSettingDetailComponent } from './cashback_management/cashback-setting-detail/cashback-setting-detail.component';
import { LottoRulesAddComponent } from './lotto-setting/lotto-rules-add/lotto-rules-add.component';
import { LottoGroupListMappingComponent } from './lotto-setting/lotto-group-list-mapping/lotto-group-list-mapping.component';
import { LottoGroupListDialogComponent } from './lotto-setting/lotto-group-list-mapping/lotto-group-list-dialog/lotto-group-list-dialog.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    DashboardComponent,
    RebateHistoryNewComponent,
    RebateSettingNewComponent,
    PlayerListComponent,
    NewRegistrantComponent,
    RebatePendingNewComponent,
    FailedLoginComponent,
    FailedRegistrationComponent,
    TagManagementComponent,
    GroupLevelComponent,
    RebateSettingNewAddComponent,
    WalletTranferComponent,
    WithdrawalListComponent,
    DepositListComponent,
    WithdrawalConditionComponent,
    BankListComponent,
    CompanyAccountComponent,
    CompanyAccountLogComponent,
    ManualAdjustmentComponent,
    ConcurrentPlayersComponent,

    PromotionRuleSettingComponent,
    PromotionRequestAddComponent,
    PromotionRequestSystemDeclinedComponent,
    PromotionRequestComponent,

    AgentTeamApplyListComponent,
    AgentTeamListComponent,
    AgentTeamReportComponent,
    AgentPositionTakingComponent,
    AgentAdjustmentComponent,

    IpfpRuleComponent,
    IpRuleComponent,

    OverallReportComponent,

    GameListComponent,
    ProductMaintenanceComponent,
    SportsValidBetsComponent,
    ProviderSettingComponent,

    AffiliateListComponent,
    AffiliateBonusSettingComponent,

    AdminListComponent,
    RolePremissionComponent,
    AdminLogsComponent,

    RebateHistoryComponent,
    RebateSettingComponent,
    PendingRebateComponent,
    RebateStartNewComponent,
    BettingHostoriesComponent,
    PlayerValidBetsComponent,
    GameReportComponent,
    PlayerReportComponent,
    ProfitOrLossReportComponent,
    PromotionReportComponent,
    AllTransactionComponent,

    GroupLevelAddNewGroupComponent,
    GroupLevelAdjustLevelComponent,
    GroupLevelLevelAdjustmentRecordComponent,
    PlayerlistNewPlayerComponent,
    //Dialog
    PromotionRuleSettingAddComponent,
    DepositListAddComponent,
    WithdrawalListAddComponent,
    NewAdminComponent,
    ConfirmReAssignLevelComponent,
    PrsUniversalSettingComponent,
    IpRuleAddComponent,

    NewTagDialogComponent,
    PrsEditDisplayOrderComponent,
    AddBankDialogComponent,
    RebateSettingAddComponent,
    AddCompanyAccountDialogComponent,
    AgentTeamListAddComponent,
    RolePremissionAddComponent,
    DepositRequestDetailComponent,
    PlayerProfileComponent,
    GameListDisplayNameDialogComponent,
    PromotionRuleSettingAddFirstAndSecondDepositComponent,
    ProviderAddDialogComponent,
    GamesAddDialogComponent,
    PromotionRuleSettingAddRegistrantionComponent,
    RebateSettingNewAddDialogComponent,
    PromotionRuleSettingAddCustomizedComponent,
    AffiliateGroupComponent,
    AffiliateGroupAddComponent,
    AffiliateProfileComponent,
    PrsReviewPageComponent,
    CashbackHistoryNewComponent,
    CashbackPendingNewComponent,
    CashbackSettingNewComponent,
    CashbackSettingNewAddComponent,
    CashbackStartNewComponent,
    CashbackSettingNewAddDialogComponent,
    BankVerifyComponent,
    PromotionRequestDialogComponent,
    LottoGovernmentComponent,
    LottoStockComponent,
    LottoYikiComponent,
    LottoGovernmentAddComponent,
    LottoGovernmentLimitNumberComponent,
    LottoGovernmentLimitNumberDialogComponent,
    LottoHistoryComponent,
    LottoHistoryDetailComponent,
    LottoConfigComponent,
    LottoConfigAddGroupComponent,
    LottoConfigAddMaxMinComponent,
    LottoConfigAddPrizeComponent,
    LottoConfigDialogConfirmComponent,
    PromotionRuleSettingAddGeneralDepositComponent,
    LottoDashboardComponent,
    HotIssueComponent,
    IssueTypeAddDialogComponent,
    HotIssueDialogComponent,
    PrsShowSettingComponent,
    PromotionRuleSettingAddPromotionPostingComponent,
    LottoGroupComponent,
    LottoGroupAddEditComponent,
    ProductMappingDialogComponent,
    WithdrawalListRemarkDialogComponent,
    LottoApprovedComponent,
    LottoApprovedDetailComponent,
    LottoResultComponent,
    GroupMappingProviderDialogComponent,
    GroupAddDialogComponent,
    LottoRemarkComponent,
    LottoResultComponent,
    LottoReportComponent,
    LottoReportDetailComponent,
    LottoStockAddComponent,
    ConfirmTransactionComponent,
    LottoGovernmentCloseNumberComponent,
    LottoGovernmentCloseNumberDialogComponent,
    LottoDraftClassComponent,
    PromotionRuleSettingReviewDialogComponent,
    YeekeeAddComponent,
    ProductTypeListComponent,
    GameGroupListComponent,
    ProviderListComponent,
    GameTagSettingComponent,
    GameTagEditDialogComponent,
    GameTagOrderEditDialogComponent,
    YeekeeAddPrizeComponent,
    YeekeeAddMaxMinComponent,
    YeekeeAddWinSeqPrizeComponent,
    YeekeeAddDummyUserComponent,

    GameTagAddGameDialogComponent,

    YeekeeApproveComponent,

    YeekeeApproveDetailComponent,

    ContactUsComponent,

    InboxMessageComponent,

    SendMessageDialogComponent,

    LottoCancelComponent,

    LandingSettingComponent,

    LandingSettingAddComponent,

    DepositSettingComponent,

    LottoReportRoundComponent,

    CashbackSettingDetailComponent,

    LottoRulesAddComponent,

    LottoGroupListMappingComponent,

    LottoGroupListDialogComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    TimepickerModule.forRoot(),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMaskModule.forRoot(maskConfig),
  ],
})
export class PagesModule {}
