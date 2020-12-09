import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaytabsPage } from './paytabs.page';

const routes: Routes = [
  {
    path: '',
    component: PaytabsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaytabsPageRoutingModule {}
