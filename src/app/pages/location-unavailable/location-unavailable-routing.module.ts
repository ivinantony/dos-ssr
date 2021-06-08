import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationUnavailablePage } from './location-unavailable.page';

const routes: Routes = [
  {
    path: '',
    component: LocationUnavailablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationUnavailablePageRoutingModule {}
