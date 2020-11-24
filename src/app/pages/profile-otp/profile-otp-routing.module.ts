import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileOTPPage } from './profile-otp.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileOTPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileOTPPageRoutingModule {}
