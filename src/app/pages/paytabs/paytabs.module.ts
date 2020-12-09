import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaytabsPageRoutingModule } from './paytabs-routing.module';

import { PaytabsPage } from './paytabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaytabsPageRoutingModule
  ],
  declarations: [PaytabsPage]
})
export class PaytabsPageModule {}
