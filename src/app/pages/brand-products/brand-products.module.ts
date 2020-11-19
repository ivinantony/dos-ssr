import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandProductsPageRoutingModule } from './brand-products-routing.module';

import { BrandProductsPage } from './brand-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrandProductsPageRoutingModule
  ],
  declarations: [BrandProductsPage]
})
export class BrandProductsPageModule {}
