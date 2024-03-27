import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RebateStartNewComponent } from './rebate-start-new/rebate-start-new.component';
import { RebateHistoryNewComponent } from './rebate-history-new/rebate-history-new.component';
import { RebatePendingNewComponent } from './rebate-pending-new/rebate-pending-new.component';
import { RebateSettingNewComponent } from './rebate-setting-new/rebate-setting-new.component';
import { RebateSettingNewAddComponent } from './rebate-setting-new-add/rebate-setting-new-add.component';


const routes: Routes = [
  { path: '', redirectTo: '' },
  { path: 'rebate-setting-new', component: RebateSettingNewComponent },
    { path: 'rebate-setting-new-add', component: RebateSettingNewAddComponent },
  { path: 'rebate-pending-new', component: RebatePendingNewComponent },
  { path: 'rebate-history-new', component: RebateHistoryNewComponent },
  { path: 'rebate-start-new', component: RebateStartNewComponent },


  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RebateManagementRoutingModule {}

