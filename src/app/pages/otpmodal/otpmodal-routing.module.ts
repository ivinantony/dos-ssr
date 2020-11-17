import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpmodalPage } from './otpmodal.page';

const routes: Routes = [
  {
    path: '',
    component: OtpmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpmodalPageRoutingModule {}
