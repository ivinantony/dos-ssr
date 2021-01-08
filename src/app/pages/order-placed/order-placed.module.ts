import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPlacedPageRoutingModule } from './order-placed-routing.module';

import { OrderPlacedPage } from './order-placed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPlacedPageRoutingModule,
    
  ],
  declarations: [OrderPlacedPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderPlacedPageModule {}
