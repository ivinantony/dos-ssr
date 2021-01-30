import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingpolicyPageRoutingModule } from './shippingpolicy-routing.module';

import { ShippingpolicyPage } from './shippingpolicy.page';
import { QuillModule } from 'ngx-quill'
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingpolicyPageRoutingModule,
    QuillModule.forRoot(),
    SharedComponentsModule,
    
  ],
  declarations: [ShippingpolicyPage]
})
export class ShippingpolicyPageModule {}
