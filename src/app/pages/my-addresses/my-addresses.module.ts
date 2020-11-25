import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAddressesPageRoutingModule } from './my-addresses-routing.module';

import { MyAddressesPage } from './my-addresses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAddressesPageRoutingModule
  ],
  declarations: [MyAddressesPage]
})
export class MyAddressesPageModule {}
