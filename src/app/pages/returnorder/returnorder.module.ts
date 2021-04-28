import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnorderPageRoutingModule } from './returnorder-routing.module';

import { ReturnorderPage } from './returnorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnorderPageRoutingModule
  ],
  declarations: [ReturnorderPage]
})
export class ReturnorderPageModule {}
