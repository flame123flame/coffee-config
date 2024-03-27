import { LottoGroupListMappingComponent } from './lotto-group-list-mapping/lotto-group-list-mapping.component';
import { LottoRulesAddComponent } from './lotto-rules-add/lotto-rules-add.component';
import { YeekeeAddWinSeqPrizeComponent } from './yeekee-add-win-seq-prize/yeekee-add-win-seq-prize.component';
import { YeekeeAddMaxMinComponent } from './yeekee-add-max-min/yeekee-add-max-min.component';
import { LottoReportComponent } from './lotto-report/lotto-report.component';
import { LottoReportDetailComponent } from './lotto-report/lotto-report-detail/lotto-report-detail.component';
import { LottoResultComponent } from './lotto-result/lotto-result.component';
import { LottoApprovedDetailComponent } from './lotto-approved/lotto-approved-detail/lotto-approved-detail.component';
import { LottoGroupComponent } from './lotto-group/lotto-group.component';
import { LottoDashboardComponent } from './lotto-dashboard/lotto-dashboard.component';
import { LottoHistoryDetailComponent } from './lotto-history-detail/lotto-history-detail.component';
import { LottoHistoryComponent } from './lotto-history/lotto-history.component';
import { LottoGovernmentAddComponent } from './lotto-government-add/lotto-government-add.component';
import { LottoGovernmentComponent } from './lotto-government/lotto-government.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LottoStockComponent } from './lotto-stock/lotto-stock.component';
import { LottoStockAddComponent } from './lotto-stock-add/lotto-stock-add.component';
import { LottoYikiComponent } from './lotto-yiki/lotto-yiki.component';
import { LottoGovernmentLimitNumberComponent } from './lotto-government-limit-number/lotto-government-limit-number.component';
import { LottoConfigComponent } from './lotto-config/lotto-config.component';
import { LottoConfigAddGroupComponent } from './lotto-config-add-group/lotto-config-add-group.component';
import { LottoConfigAddMaxMinComponent } from './lotto-config-add-max-min/lotto-config-add-max-min.component';
import { LottoConfigAddPrizeComponent } from './lotto-config-add-prize/lotto-config-add-prize.component';
import { LottoGroupAddEditComponent } from './lotto-group-add-edit/lotto-group-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LottoApprovedComponent } from './lotto-approved/lotto-approved.component';
import { ConfirmTransactionComponent } from './confirm-transaction/confirm-transaction.component';
import { LottoGovernmentCloseNumberComponent } from './lotto-government-close-number/lotto-government-close-number.component';
import { LottoDraftClassComponent } from './lotto-draft-class/lotto-draft-class.component';
import { YeekeeAddComponent } from './yeekee-add/yeekee-add.component';
import { YeekeeAddPrizeComponent } from './yeekee-add-prize/yeekee-add-prize.component';
import { YeekeeAddDummyUserComponent } from './yeekee-add-dummy-user/yeekee-add-dummy-user.component';
import { YeekeeApproveComponent } from './yeekee-approve/yeekee-approve.component';
import { YeekeeApproveDetailComponent } from './yeekee-approve-detail/yeekee-approve-detail.component';
import { LottoCancelComponent } from './lotto-cancel/lotto-cancel.component';
import { LottoReportRoundComponent } from './lotto-report/lotto-report-round/lotto-report-round.component';

const routes: Routes = [
  { path: '', redirectTo: 'lotto-dashboard' },
  { path: 'lotto-dashboard', component: LottoDashboardComponent },
  { path: 'lotto-government/limit-number', component: LottoGovernmentLimitNumberComponent },
  { path: 'lotto-government/close-number', component: LottoGovernmentCloseNumberComponent },
  { path: 'lotto-stock/limit-number', component: LottoGovernmentLimitNumberComponent },
  { path: 'lotto-government/lotto-government-add', component: LottoGovernmentAddComponent },
  { path: 'lotto-government', component: LottoGovernmentComponent },
  { path: 'lotto-stock', component: LottoStockComponent },
  { path: 'lotto-stock/lotto-stock-add', component: LottoStockAddComponent },
  { path: 'lotto-yeekee', component: LottoYikiComponent },
  { path: 'lotto-history', component: LottoHistoryComponent },
  { path: 'lotto-history/lotto-history-detail', component: LottoHistoryDetailComponent },
  { path: 'lotto-stock/lotto-config', component: LottoConfigComponent },
  { path: 'lotto-government/lotto-config', component: LottoConfigComponent },
  { path: 'lotto-government/lotto-config/add-group', component: LottoConfigAddGroupComponent },
  { path: 'lotto-government/lotto-config/add-max-min', component: LottoConfigAddMaxMinComponent },
  { path: 'lotto-government/lotto-config/add-prize', component: LottoConfigAddPrizeComponent },
  { path: 'lotto-group', component: LottoGroupComponent },
  { path: 'lotto-group/add-edit', component: LottoGroupAddEditComponent },
  { path: 'lotto-approved', component: LottoApprovedComponent },
  { path: 'lotto-approved-detail', component: LottoApprovedDetailComponent },
  { path: 'lotto-result-add', component: LottoResultComponent },
  { path: 'lotto-report', component: LottoReportComponent },
  { path: 'lotto-report-detail', component: LottoReportDetailComponent },
  { path: 'lotto-report-round', component: LottoReportRoundComponent },  
  { path: 'lotto-approved', component: LottoApprovedComponent },
  { path: 'lotto-approved-detail', component: LottoApprovedDetailComponent },
  { path: 'lotto-result-add', component: LottoResultComponent },
  { path: 'confirm-transaction', component: ConfirmTransactionComponent },
  { path: 'lotto-draft-class', component: LottoDraftClassComponent },
  { path: 'lotto-yeekee/lotto-yeekee-add', component: YeekeeAddComponent },
  { path: 'lotto-yeekee/lotto-yeekee-add-prize', component: YeekeeAddPrizeComponent},
  { path: 'lotto-yeekee/lotto-yeekee-add-max-min', component: YeekeeAddMaxMinComponent},
  { path: 'lotto-yeekee/lotto-yeekee-add-seq-win-prize', component: YeekeeAddWinSeqPrizeComponent},
  { path: 'lotto-yeekee/lotto-yeekee-add-dummy-user', component: YeekeeAddDummyUserComponent},
  { path: 'lotto-yeekee-approved', component: YeekeeApproveComponent},
  { path: 'lotto-yeekee-approved/lotto-yeekee-approved-detail', component: YeekeeApproveDetailComponent},
  { path: 'lotto-cancel', component: LottoCancelComponent},
  { path: 'lotto-rules-add' ,component: LottoRulesAddComponent},
  { path: 'lotto-group-list',component: LottoGroupListMappingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, CommonModule],
  exports: [RouterModule],
})
export class LottoSettingRoutingModule { }
