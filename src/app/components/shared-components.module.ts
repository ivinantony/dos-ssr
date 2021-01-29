import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopHeaderComponent } from './desktop-header/desktop-header.component';



@NgModule({
  declarations: [DesktopHeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [DesktopHeaderComponent]
})
export class SharedComponentsModule { }
