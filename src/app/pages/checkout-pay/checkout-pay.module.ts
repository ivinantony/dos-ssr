import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPayPageRoutingModule } from './checkout-pay-routing.module';

import { CheckoutPayPage } from './checkout-pay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPayPageRoutingModule
  ],
  declarations: [CheckoutPayPage]
})
export class CheckoutPayPageModule {}
