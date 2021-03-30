import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnorderPage } from './returnorder.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnorderPageRoutingModule {}
