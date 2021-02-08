import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechargeStatusPage } from './recharge-status.page';

const routes: Routes = [
  {
    path: '',
    component: RechargeStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechargeStatusPageRoutingModule {}
