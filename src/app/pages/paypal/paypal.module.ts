import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaypalPageRoutingModule } from './paypal-routing.module';

import { PaypalPage } from './paypal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaypalPageRoutingModule,
  ],
  declarations: [PaypalPage],
  providers:[InAppBrowser]
})
export class PaypalPageModule {}
