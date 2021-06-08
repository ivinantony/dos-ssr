import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuantityUnavailablePage } from './quantity-unavailable.page';

const routes: Routes = [
  {
    path: '',
    component: QuantityUnavailablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuantityUnavailablePageRoutingModule {}
