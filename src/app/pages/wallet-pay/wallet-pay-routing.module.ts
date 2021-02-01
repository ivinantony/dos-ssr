import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletPayPage } from './wallet-pay.page';

const routes: Routes = [
  {
    path: '',
    component: WalletPayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletPayPageRoutingModule {}
