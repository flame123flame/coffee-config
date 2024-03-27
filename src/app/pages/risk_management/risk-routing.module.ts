import { IpfpRuleComponent } from './ipfp-rule/ipfp-rule.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IpRuleComponent } from './ip-rule/ip-rule.component';
const routes: Routes = [
    { path: '', redirectTo: 'ip-rule' },
    { path: 'ip-rule', component:  IpRuleComponent},
    { path: 'ipfp-rule', component: IpfpRuleComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RiskRoutingModule { }
