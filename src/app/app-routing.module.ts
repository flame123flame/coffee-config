import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import RoutesList from './config/routes';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = RoutesList;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {}
