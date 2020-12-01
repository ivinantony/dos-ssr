import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appFadeHeader]'
})
export class FadeHeaderDirective {
  @Input('appFadeHeader') toolbar: any;
  private toolbarHeight = 44;
  constructor(private domCtrl: DomController) { }
  ngOnInit(): void {
    this.toolbar = this.toolbar.el;
    this.domCtrl.read(() => {
      this.toolbarHeight = this.toolbar.clientHeight;
    })
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {

    let scrollTop = $event.detail.scrollTop;
    if (scrollTop >= 255) {
      scrollTop = 255
    }
    const hexDist = scrollTop.toString(16)
    this.domCtrl.write(() => {
      // this.toolbar.style.setProperty('--background', `#36b448${hexDist}`)
      // this.toolbar.style.setProperty('--background', `linear-gradient(45deg, #0083b0${hexDist} , #00b4db${hexDist}`)
    })
  }
}
