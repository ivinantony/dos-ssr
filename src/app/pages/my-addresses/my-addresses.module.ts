import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAddressesPageRoutingModule } from './my-addresses-routing.module';

import { MyAddressesPage } from './my-addresses.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAddressesPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [MyAddressesPage]
})
export class MyAddressesPageModule {}
