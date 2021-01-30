import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaypalPageRoutingModule } from './paypal-routing.module';

import { PaypalPage } from './paypal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaypalPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [PaypalPage],
  providers:[InAppBrowser]
})
export class PaypalPageModule {}
