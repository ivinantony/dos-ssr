import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModeofpaymentPageRoutingModule } from './modeofpayment-routing.module';

import { ModeofpaymentPage } from './modeofpayment.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModeofpaymentPageRoutingModule,
  ],
  declarations: [ModeofpaymentPage]
})
export class ModeofpaymentPageModule {}
