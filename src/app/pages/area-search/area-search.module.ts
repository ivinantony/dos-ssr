import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaSearchPageRoutingModule } from './area-search-routing.module';

import { AreaSearchPage } from './area-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaSearchPageRoutingModule
  ],
  declarations: [AreaSearchPage]
})
export class AreaSearchPageModule {}
