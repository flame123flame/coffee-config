import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminListComponent } from './admin-list/admin-list.component';
import { RolePremissionComponent } from './role-premission/role-premission.component';
import { AdminLogsComponent } from './admin-logs/admin-logs.component';
import { NewAdminComponent } from './admin-list/chlidren/new-admin/new-admin.component';

const routes: Routes = [
    { path: '', redirectTo: 'admin-list' },
    { path: 'admin-list', component:  AdminListComponent},
    { path: 'role-premission', component:  RolePremissionComponent},
    { path: 'admin-logs', component:  AdminLogsComponent},
   { path: 'new-admin', component:  NewAdminComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminManagementRoutingModule { }
