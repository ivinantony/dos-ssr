import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { HomePage } from './home.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedDirectivesModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    SharedComponentsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
