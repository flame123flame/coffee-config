import { MainComponent } from './../layouts/main/main.component';
import { AuthGuardService } from '../auth/auth-guard.service';

export default [
  {
    path: '',
    component: MainComponent,
    // canActivate: [AuthGuardService],
    loadChildren: () =>
      import('../pages/pages.module').then((m) => m.PagesModule),
  }
];
