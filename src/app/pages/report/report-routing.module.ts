import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverallReportComponent } from '../report/overall-report/overall-report.component';
import { BettingHostoriesComponent } from './betting-hostories/betting-hostories.component';
import { PlayerValidBetsComponent } from './player-valid-bets/player-valid-bets.component';
import { GameReportComponent } from './game-report/game-report.component';
import { PlayerReportComponent } from './player-report/player-report.component';
import { ProfitOrLossReportComponent } from './profit-or-loss-report/profit-or-loss-report.component';
import { PromotionReportComponent } from './promotion-report/promotion-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'overall-report' },
  { path: 'overall-report', component: OverallReportComponent },
  { path: 'betting-hostries', component: BettingHostoriesComponent },
  { path: 'player-valid-bets', component: PlayerValidBetsComponent },
  { path: 'game-report', component: GameReportComponent },
  { path: 'player-report', component: PlayerReportComponent },
  { path: 'profit-or-loss-report', component: ProfitOrLossReportComponent },
  { path: 'promotion-report', component: PromotionReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
