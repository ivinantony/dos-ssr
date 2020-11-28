import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModeofpaymentPage } from './modeofpayment.page';

const routes: Routes = [
  {
    path: '',
    component: ModeofpaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModeofpaymentPageRoutingModule {}
