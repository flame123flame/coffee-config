import { ContactUsComponent } from './contact-us/contact-us.component';
import { PlayerProfileComponent } from './playerlist/player-profile/player-profile.component';
import { ConcurrentPlayersComponent } from './concurrent-players/concurrent-players.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerListComponent } from './playerlist/playerlist.component';
import { NewRegistrantComponent } from './new-registrant/new-registrant.component';
import { FailedLoginComponent } from './failed-login/failed-login.component';
import { FailedRegistrationComponent } from './failed-registration/failed-registration.component';
import { TagManagementComponent } from './tag-management/tag-management.component';
import { GroupLevelComponent } from './group-level/group-level.component';
import { GroupLevelAddNewGroupComponent } from './group-level-add-new-group/group-level-add-new-group.component';
import { GroupLevelAdjustLevelComponent } from './group-level-adjust-level/group-level-adjust-level.component';
import { GroupLevelLevelAdjustmentRecordComponent } from './group-level-level-adjustment-record/group-level-level-adjustment-record.component';
import { PlayerlistNewPlayerComponent } from './playerlist-new-player/playerlist-new-player.component';
import { BankVerifyComponent } from './bank-verify/bank-verify.component';
import { BaseService } from 'src/app/service/BaseService.service';

const routes: Routes = [
  { path: '', redirectTo: 'player-list' },
  { path: 'concurrent-players', component: ConcurrentPlayersComponent },
  { path: 'player-list', component: PlayerListComponent },
  { path: 'player-list/player-profile', component: PlayerProfileComponent },
  { path: 'new-registrant', component: NewRegistrantComponent },
  { path: 'failed-login', component: FailedLoginComponent },
  { path: 'failed-registration', component: FailedRegistrationComponent },
  { path: 'group-level', component: GroupLevelComponent },
  { path: 'tag-management', component: TagManagementComponent },
  { path: 'group-level/group-level-add-new-group', component: GroupLevelAddNewGroupComponent },
  { path: 'group-level/group-level-adjust-level', component: GroupLevelAdjustLevelComponent },
  { path: 'group-level/group-level-level-adjustment-record', component: GroupLevelLevelAdjustmentRecordComponent },
  { path: 'player-list/playerlist-new-player', component: PlayerlistNewPlayerComponent },
  { path: 'bank-verify', component: BankVerifyComponent },
  { path: 'contact-us', component: ContactUsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PlayerManageRoutingModule { }
