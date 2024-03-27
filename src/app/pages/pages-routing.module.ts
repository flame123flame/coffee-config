import { FrontendRoutingModule } from './frontend_management/frontend-routing.module';
import { from } from 'rxjs';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'player-management'
  },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'player-management',
    loadChildren: () =>
      import('./player_management/player-manage-routing.module').then(
        (m) => m.PlayerManageRoutingModule
      ),
  },
  {
    path: 'finance-management',
    loadChildren: () =>
      import('./finance_management/finance-routing.module').then(
        (m) => m.FinanceRoutingModule
      ),
  },
  {
    path: 'promotion-management',
    loadChildren: () =>
      import('./promotion_management/promotion-routing.module').then(
        (m) => m.PromotionRoutingModule
      ),
  },
  {
    path: 'frontend-management',
    loadChildren: () =>
      import('./frontend_management/frontend-routing.module').then(
        (m) => m.FrontendRoutingModule
      ),
  },
  {
    path: 'affiliate',
    loadChildren: () =>
      import('./affiliate/affiliate-routing.module').then(
        (m) => m.AffiliateRoutingModule
      ),
  },
  {
    path: 'risk-management',
    loadChildren: () =>
      import('./risk_management/risk-routing.module').then(
        (m) => m.RiskRoutingModule
      ),
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./report/report-routing.module').then(
        (m) => m.ReportRoutingModule
      ),
  },
  {
    path: 'casino-settings',
    loadChildren: () =>
      import('./casino_settings/casino-settings-routing.module').then(
        (m) => m.CasinoSettingsRoutingModule
      ),
  },
  {
    path: 'lotto-settings',
    loadChildren: () =>
      import('./lotto-setting/lotto-setting-routing.module').then(
        (m) => m.LottoSettingRoutingModule
      ),
  },
  {
    path: 'admin-management',
    loadChildren: () =>
      import('./admin_management/admin-management-routing.module').then(
        (m) => m.AdminManagementRoutingModule
      ),
  },
  {
    path: 'rebate-management',
    loadChildren: () =>
      import('./rebate_management/rebate-management-routing.module').then(
        (m) => m.RebateManagementRoutingModule
      ),
  },
  {
    path: 'cashback-management',
    loadChildren: () =>
      import('./cashback_management/cashback-management-routing.module').then(
        (m) => m.CashbackManagementRoutingModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
