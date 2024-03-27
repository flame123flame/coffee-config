import { AffiliateProfileComponent } from './affiliate-profile/affiliate-profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AffiliateListComponent } from './affiliate-list/affiliate-list.component';
import { AffiliateGroupComponent } from './affiliate-group/affiliate-group.component';
import { AffiliateGroupAddComponent } from './affiliate-group/affiliate-group-add/affiliate-group-add.component';
const routes: Routes = [
    { path: '', redirectTo: 'affiliate-list' },
    { path: 'affiliate-list', component:  AffiliateListComponent},
    { path: 'affiliate-profile', component:  AffiliateProfileComponent},
    { path: 'affiliate-group', component:  AffiliateGroupComponent},
    { path: 'affiliate-group/affiliate-group-add', component:  AffiliateGroupAddComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AffiliateRoutingModule { }
