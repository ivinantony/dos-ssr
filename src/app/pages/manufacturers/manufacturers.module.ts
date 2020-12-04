import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManufacturersPageRoutingModule } from './manufacturers-routing.module';

import { ManufacturersPage } from './manufacturers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturersPageRoutingModule
  ],
  declarations: [ManufacturersPage]
})
export class ManufacturersPageModule {}
