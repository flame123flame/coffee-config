import { NgModule } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../../layouts/login/login.component';
import { LoginGuardService } from './login-guard.service';

const loginRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [LoginGuardService],
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(loginRoutes), CommonModule],
  providers: [AuthService, LoginGuardService],
})
export class LoginRoutingModule { }
