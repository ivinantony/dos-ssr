import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuantityUnavailablePageRoutingModule } from './quantity-unavailable-routing.module';

import { QuantityUnavailablePage } from './quantity-unavailable.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuantityUnavailablePageRoutingModule
  ],
  declarations: [QuantityUnavailablePage]
})
export class QuantityUnavailablePageModule {}
