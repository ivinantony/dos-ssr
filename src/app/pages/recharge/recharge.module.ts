import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechargePageRoutingModule } from './recharge-routing.module';

import { RechargePage } from './recharge.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechargePageRoutingModule,
    ReactiveFormsModule,
    SharedComponentsModule
  ],
  declarations: [RechargePage],
  providers:[InAppBrowser]
})
export class RechargePageModule {}
