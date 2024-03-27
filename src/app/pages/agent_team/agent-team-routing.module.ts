import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentTeamApplyListComponent } from './agent-team-apply-list/agent-team-apply-list.component';
import { AgentTeamListComponent } from './agent-team-list/agent-team-list.component';
import { AgentTeamReportComponent } from './agent-team-report/agent-team-report.component';
import { AgentPositionTakingComponent } from './agent-position-taking/agent-position-taking.component';
import { AgentAdjustmentComponent } from './agent-adjustment/agent-adjustment.component';
import { AgentTeamListAddComponent } from './agent-team-list-add/agent-team-list-add.component';

const routes: Routes = [
  { path: '', redirectTo: 'team-list' },
  { path: 'team-list', component: AgentTeamListComponent },
  { path: 'team-list/team-list-add', component: AgentTeamListAddComponent },
  { path: 'team-report', component: AgentTeamReportComponent },
  { path: 'position-taking', component: AgentPositionTakingComponent },
  { path: 'apply-list', component: AgentTeamApplyListComponent },
  { path: 'adjustment', component: AgentAdjustmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentTeamRoutingModule { }
