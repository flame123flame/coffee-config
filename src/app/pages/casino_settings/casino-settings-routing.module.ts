import { GameTagSettingComponent } from './game-tag-setting/game-tag-setting.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProductTypeListComponent } from './product-type-list/product-type-list.component';
import { ProviderSettingComponent } from './provider-setting/provider-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';
import { ProductMaintenanceComponent } from '../casino_settings/product-maintenance/product-maintenance.component';
import { SportsValidBetsComponent } from '../casino_settings/sports-valid-bets/sports-valid-bets.component';
import { GameGroupListComponent } from './game-group-list/game-group-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'game-list' },
  { path: 'game-list', component: GameListComponent },
  { path: 'product-type-list', component: ProductTypeListComponent },
  { path: 'game-group-list', component: GameGroupListComponent },
  { path: 'provider-list', component: ProviderListComponent },
  { path: 'product-maintenance', component: ProductMaintenanceComponent},
  { path: 'game-tag-setting', component: GameTagSettingComponent},
  { path: 'sports-valid-bets', component: SportsValidBetsComponent},
  { path: 'provider-setting', component: ProviderSettingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasinoSettingsRoutingModule {}
