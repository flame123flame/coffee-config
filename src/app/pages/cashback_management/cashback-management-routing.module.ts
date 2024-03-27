import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashbackStartNewComponent } from './cashback-start-new/cashback-start-new.component';
import { CashbackHistoryNewComponent } from './cashback-history-new/cashback-history-new.component';
import { CashbackPendingNewComponent } from './cashback-pending-new/cashback-pending-new.component';
import { CashbackSettingNewComponent } from './cashback-setting-new/cashback-setting-new.component';
import { CashbackSettingDetailComponent } from './cashback-setting-detail/cashback-setting-detail.component';
import { CashbackSettingNewAddComponent } from './cashback-setting-new-add/cashback-setting-new-add.component';


const routes: Routes = [
  { path: '', redirectTo: '' },
  { path: 'cashback-setting-new', component: CashbackSettingNewComponent },
  { path: 'cashback-setting-new-add', component: CashbackSettingNewAddComponent },
  { path: 'cashback-pending-new', component: CashbackPendingNewComponent },
  { path: 'cashback-history-new', component: CashbackHistoryNewComponent },
  { path: 'cashback-start-new', component: CashbackStartNewComponent },
  { path: 'cashback-setting-detail', component: CashbackSettingDetailComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashbackManagementRoutingModule { }
