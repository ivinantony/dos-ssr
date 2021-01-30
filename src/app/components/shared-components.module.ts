import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopHeaderComponent } from './desktop-header/desktop-header.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [DesktopHeaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [DesktopHeaderComponent]
})
export class SharedComponentsModule { }
