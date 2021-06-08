import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationUnavailablePageRoutingModule } from './location-unavailable-routing.module';

import { LocationUnavailablePage } from './location-unavailable.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationUnavailablePageRoutingModule
  ],
  declarations: [LocationUnavailablePage]
})
export class LocationUnavailablePageModule {}
