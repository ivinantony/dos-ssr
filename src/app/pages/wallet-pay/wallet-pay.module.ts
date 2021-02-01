import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPayPageRoutingModule } from './wallet-pay-routing.module';

import { WalletPayPage } from './wallet-pay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletPayPageRoutingModule
  ],
  declarations: [WalletPayPage]
})
export class WalletPayPageModule {}
