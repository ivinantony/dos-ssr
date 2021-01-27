import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechargeStatusPageRoutingModule } from './recharge-status-routing.module';

import { RechargeStatusPage } from './recharge-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechargeStatusPageRoutingModule
  ],
  declarations: [RechargeStatusPage]
})
export class RechargeStatusPageModule {}
