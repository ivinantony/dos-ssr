import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandProductsPage } from './brand-products.page';

const routes: Routes = [
  {
    path: '',
    component: BrandProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandProductsPageRoutingModule {}
