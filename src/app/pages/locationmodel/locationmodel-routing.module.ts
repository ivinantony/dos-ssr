import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationmodelPage } from './locationmodel.page';

const routes: Routes = [
  {
    path: '',
    component: LocationmodelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationmodelPageRoutingModule {}
