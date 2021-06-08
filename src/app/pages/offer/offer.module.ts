import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferPageRoutingModule } from './offer-routing.module';

import { OfferPage } from './offer.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { JwPaginationModule } from 'jw-angular-pagination';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JwPaginationModule,
    OfferPageRoutingModule,
    SharedComponentsModule,
    NgxPaginationModule,
    SharedComponentsModule
  ],
  declarations: [OfferPage]
})
export class OfferPageModule {}
