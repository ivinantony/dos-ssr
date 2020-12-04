import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturersPage } from './manufacturers.page';

const routes: Routes = [
  {
    path: '',
    component: ManufacturersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturersPageRoutingModule {}
