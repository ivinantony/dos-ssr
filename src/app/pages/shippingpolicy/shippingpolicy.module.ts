import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingpolicyPageRoutingModule } from './shippingpolicy-routing.module';

import { ShippingpolicyPage } from './shippingpolicy.page';
import { QuillModule } from 'ngx-quill'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingpolicyPageRoutingModule,
    QuillModule.forRoot(),
  ],
  declarations: [ShippingpolicyPage]
})
export class ShippingpolicyPageModule {}
