import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnandrefundPage } from './returnandrefund.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnandrefundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnandrefundPageRoutingModule {}
