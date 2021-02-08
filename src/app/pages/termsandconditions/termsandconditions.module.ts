import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsandconditionsPageRoutingModule } from './termsandconditions-routing.module';

import { TermsandconditionsPage } from './termsandconditions.page';
import { QuillModule } from 'ngx-quill'
import { SharedComponentsModule } from 'src/app/components/shared-components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsandconditionsPageRoutingModule,
    QuillModule.forRoot(),
    SharedComponentsModule
  ],
  declarations: [TermsandconditionsPage]
})
export class TermsandconditionsPageModule {}
