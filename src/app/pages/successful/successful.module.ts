import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessfulPageRoutingModule } from './successful-routing.module';

import { SuccessfulPage } from './successful.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessfulPageRoutingModule
  ],
  declarations: [SuccessfulPage]
})
export class SuccessfulPageModule {}
