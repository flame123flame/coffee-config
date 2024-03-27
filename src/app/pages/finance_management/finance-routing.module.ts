import { CompanyAccountLogComponent } from './company-account-log/company-account-log.component';
import { WithdrawalListAddComponent } from './withdrawal-list-add/withdrawal-list-add.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletTranferComponent } from './wallet-tranfer/wallet-tranfer.component';
import { WithdrawalListComponent } from './withdrawal-list/withdrawal-list.component';
import { DepositListComponent } from './deposit-list/deposit-list.component';
import { WithdrawalConditionComponent } from './withdrawal-condition/withdrawal-condition.component';
import { BankListComponent } from './bank-list/bank-list.component';
import { CompanyAccountComponent } from './company-account/company-account.component';
import { ManualAdjustmentComponent } from './manual-adjustment/manual-adjustment.component';
import { AllTransactionComponent } from './all-transaction/all-transaction.component';
import { DepositListAddComponent } from './deposit-list-add/deposit-list-add.component';

const routes: Routes = [
  { path: '', redirectTo: 'all-transaction' },
  { path: 'all-transaction', component: AllTransactionComponent },
  { path: 'wallet-tranfer', component: WalletTranferComponent },
  { path: 'deposit-list', component: DepositListComponent },
  { path: 'deposit-list/deposit-list-add', component: DepositListAddComponent },
  { path: 'withdrawal-list', component: WithdrawalListComponent },
  { path: 'withdrawal-list/withdrawal-list-add', component: WithdrawalListAddComponent },
  { path: 'withdrawal-condition', component: WithdrawalConditionComponent },
  { path: 'bank-list', component: BankListComponent },
  { path: 'company-account', component: CompanyAccountComponent },
  { path: 'company-account-log', component: CompanyAccountLogComponent },
  { path: 'manual-adjustment', component: ManualAdjustmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule { }
