import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileOTPPageRoutingModule } from './profile-otp-routing.module';

import { ProfileOTPPage } from './profile-otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileOTPPageRoutingModule
  ],
  declarations: [ProfileOTPPage]
})
export class ProfileOTPPageModule {}
