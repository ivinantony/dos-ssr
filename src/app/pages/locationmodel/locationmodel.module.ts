import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationmodelPageRoutingModule } from './locationmodel-routing.module';

import { LocationmodelPage } from './locationmodel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationmodelPageRoutingModule
  ],
  declarations: [LocationmodelPage]
})
export class LocationmodelPageModule {}
