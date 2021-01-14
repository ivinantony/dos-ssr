import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsandconditionsPageRoutingModule } from './termsandconditions-routing.module';

import { TermsandconditionsPage } from './termsandconditions.page';
import { QuillModule } from 'ngx-quill'



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsandconditionsPageRoutingModule,
    QuillModule.forRoot(),
  ],
  declarations: [TermsandconditionsPage]
})
export class TermsandconditionsPageModule {}
