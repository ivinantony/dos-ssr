import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelorderPage } from './cancelorder.page';

const routes: Routes = [
  {
    path: '',
    component: CancelorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelorderPageRoutingModule {}
