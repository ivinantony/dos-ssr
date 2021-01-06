import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { NgxImageZoomModule } from 'ngx-image-zoom';

import { QuillModule } from 'ngx-quill'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    ReactiveFormsModule,
    NgxImageZoomModule,
    QuillModule.forRoot(),
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}
