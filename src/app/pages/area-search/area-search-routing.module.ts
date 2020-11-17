import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaSearchPage } from './area-search.page';

const routes: Routes = [
  {
    path: '',
    component: AreaSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaSearchPageRoutingModule {}
