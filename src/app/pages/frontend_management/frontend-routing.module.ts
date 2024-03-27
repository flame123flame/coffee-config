import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxMessageComponent } from './inbox-message/inbox-message.component';
import { LandingSettingComponent } from './landing-setting/landing-setting.component';
import { LandingSettingAddComponent } from './landing-setting/landing-setting-add/landing-setting-add.component';
import { DepositSettingComponent } from './deposit-setting/deposit-setting.component';

const routes: Routes = [
  { path: '', redirectTo: 'inbox-message' },
  { path: 'inbox-message', component: InboxMessageComponent },
  { path: 'landing-setting', component: LandingSettingComponent },
  {
    path: 'landing-setting/landing-setting-add',
    component: LandingSettingAddComponent,
  },
  { path: 'deposit-setting', component: DepositSettingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontendRoutingModule {}
