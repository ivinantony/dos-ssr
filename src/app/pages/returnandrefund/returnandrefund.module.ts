import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnandrefundPageRoutingModule } from './returnandrefund-routing.module';

import { ReturnandrefundPage } from './returnandrefund.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnandrefundPageRoutingModule
  ],
  declarations: [ReturnandrefundPage]
})
export class ReturnandrefundPageModule {}
