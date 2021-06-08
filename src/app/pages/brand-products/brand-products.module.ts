import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandProductsPageRoutingModule } from './brand-products-routing.module';

import { BrandProductsPage } from './brand-products.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { JwPaginationModule } from 'jw-angular-pagination';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrandProductsPageRoutingModule,
    SharedComponentsModule,
    JwPaginationModule
  ],
  declarations: [BrandProductsPage]
})
export class BrandProductsPageModule {}
