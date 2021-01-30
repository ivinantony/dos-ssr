import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacypolicyPageRoutingModule } from './privacypolicy-routing.module';

import { PrivacypolicyPage } from './privacypolicy.page';
import { QuillModule } from 'ngx-quill'
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacypolicyPageRoutingModule,
    QuillModule.forRoot(),
    SharedComponentsModule
  ],
  declarations: [PrivacypolicyPage]
})
export class PrivacypolicyPageModule {}
