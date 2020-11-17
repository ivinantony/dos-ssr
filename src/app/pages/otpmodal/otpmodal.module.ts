import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpmodalPageRoutingModule } from './otpmodal-routing.module';

import { OtpmodalPage } from './otpmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpmodalPageRoutingModule
  ],
  declarations: [OtpmodalPage]
})
export class OtpmodalPageModule {}
