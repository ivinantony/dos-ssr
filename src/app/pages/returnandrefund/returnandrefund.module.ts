import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnandrefundPageRoutingModule } from './returnandrefund-routing.module';

import { ReturnandrefundPage } from './returnandrefund.page';
import { QuillModule } from 'ngx-quill'



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnandrefundPageRoutingModule,
    QuillModule.forRoot(),
  ],
  declarations: [ReturnandrefundPage]
})
export class ReturnandrefundPageModule {}
